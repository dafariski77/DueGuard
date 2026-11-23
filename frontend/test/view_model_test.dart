import 'package:flutter_test/flutter_test.dart';
import 'package:dueguard/core/utils/renewal_calculator.dart';
import 'package:dueguard/data/models/enums.dart';
import 'package:dueguard/data/models/tracked_item.dart';
import 'package:dueguard/data/models/analytics_summary.dart';
import 'package:dueguard/data/repositories/items_repository_interface.dart';
import 'package:dueguard/data/repositories/analytics_repository_interface.dart';
import 'package:dueguard/presentation/viewmodels/items_view_model.dart';

class MockItemsRepo implements IItemsRepository {
  List<TrackedItem> items = [];

  @override
  Future<List<TrackedItem>> getItems({Category? category, ItemStatus? status}) async => items;

  @override
  Future<TrackedItem> getItemById(String id) async => items.firstWhere((i) => i.id == id);

  @override
  Future<TrackedItem> createItem(TrackedItem item) async {
    items.add(item);
    return item;
  }

  @override
  Future<TrackedItem> updateItem(String id, Map<String, dynamic> patchData) async => items.first;

  @override
  Future<void> deleteItem(String id) async {
    items.removeWhere((i) => i.id == id);
  }

  @override
  Future<TrackedItem> renewItem(String id) async {
    final item = items.firstWhere((i) => i.id == id);
    final rolled = TrackedItem(
      id: item.id,
      title: item.title,
      category: item.category,
      amount: item.amount,
      billingCycle: item.billingCycle,
      nextDueDate: RenewalCalculator.calculateNextDueDate(item.billingCycle, item.nextDueDate),
      reminderDaysBefore: item.reminderDaysBefore,
      status: item.status,
    );
    final idx = items.indexWhere((i) => i.id == id);
    if (idx != -1) items[idx] = rolled;
    return rolled;
  }
}

class MockAnalyticsRepo implements IAnalyticsRepository {
  @override
  Future<AnalyticsSummary> getSummary() async {
    return const AnalyticsSummary(
      estMonthlySpend: 250000,
      annualizedSpend: 3000000,
      dueThisMonth: 250000,
      upcoming90DaysSpikes: [],
      categoryBreakdown: CategoryBreakdown(subscriptionPercentage: 100),
    );
  }
}

void main() {
  group('ItemsViewModel (SOLID State Management & Separation of Concerns)', () {
    test('initializes default items and computes analytics correctly', () async {
      final itemsRepo = MockItemsRepo();
      final analyticsRepo = MockAnalyticsRepo();
      final vm = ItemsViewModel(
        itemsRepository: itemsRepo,
        analyticsRepository: analyticsRepo,
      );

      await vm.initializeDefaultData();

      expect(vm.items.isNotEmpty, isTrue);
      expect(vm.activeItemsCount, 5);
      expect(vm.analytics, isNotNull);
      expect(vm.analytics!.estMonthlySpend, greaterThan(0));
    });

    test('adds new item and notifies listeners', () async {
      final itemsRepo = MockItemsRepo();
      final analyticsRepo = MockAnalyticsRepo();
      final vm = ItemsViewModel(
        itemsRepository: itemsRepo,
        analyticsRepository: analyticsRepo,
      );

      int notifyCount = 0;
      vm.addListener(() => notifyCount++);

      final newItem = TrackedItem(
        id: 'item-new',
        title: 'Disney+ Hotstar',
        category: Category.subscription,
        amount: 65000,
        billingCycle: BillingCycle.monthly,
        nextDueDate: DateTime(2026, 5, 10),
      );

      await vm.addItem(newItem);

      expect(vm.items.any((i) => i.id == 'item-new'), isTrue);
      expect(notifyCount, greaterThan(0));
    });

    test('renews item using RenewalCalculator strategy and month clamping', () async {
      final itemsRepo = MockItemsRepo();
      final analyticsRepo = MockAnalyticsRepo();
      final vm = ItemsViewModel(
        itemsRepository: itemsRepo,
        analyticsRepository: analyticsRepo,
      );

      final jan31Item = TrackedItem(
        id: 'item-jan31',
        title: 'Monthly Cloud Backup',
        category: Category.subscription,
        amount: 50000,
        billingCycle: BillingCycle.monthly,
        nextDueDate: DateTime(2025, 1, 31),
      );

      await vm.addItem(jan31Item);
      final renewed = await vm.renewItem(jan31Item);

      expect(renewed.nextDueDate.month, 2); // Clamped to Feb
      expect(renewed.nextDueDate.day, 28); // Not March
    });

    test('deletes item and updates active count', () async {
      final itemsRepo = MockItemsRepo();
      final analyticsRepo = MockAnalyticsRepo();
      final vm = ItemsViewModel(
        itemsRepository: itemsRepo,
        analyticsRepository: analyticsRepo,
      );

      final item = TrackedItem(
        id: 'item-to-delete',
        title: 'Gym Membership',
        category: Category.subscription,
        billingCycle: BillingCycle.monthly,
        nextDueDate: DateTime.now(),
      );

      await vm.addItem(item);
      expect(vm.items.any((i) => i.id == 'item-to-delete'), isTrue);

      await vm.deleteItem('item-to-delete');
      expect(vm.items.any((i) => i.id == 'item-to-delete'), isFalse);
    });
  });
}
