import 'package:flutter/foundation.dart' hide Category;
import '../../core/utils/renewal_calculator.dart';
import '../../data/models/enums.dart';
import '../../data/models/tracked_item.dart';
import '../../data/models/analytics_summary.dart';
import '../../data/repositories/items_repository_interface.dart';
import '../../data/repositories/analytics_repository_interface.dart';

class ItemsViewModel extends ChangeNotifier {
  final IItemsRepository itemsRepository;
  final IAnalyticsRepository analyticsRepository;

  List<TrackedItem> _items = [];
  AnalyticsSummary? _analytics;
  bool _isPro = false;
  bool _isLoading = false;
  String? _errorMessage;

  ItemsViewModel({
    required this.itemsRepository,
    required this.analyticsRepository,
    List<TrackedItem>? initialItems,
    bool isPro = false,
  }) : _items = initialItems != null ? List<TrackedItem>.from(initialItems) : [] {
    _isPro = isPro;
  }

  List<TrackedItem> get items => List.unmodifiable(_items);
  AnalyticsSummary? get analytics => _analytics ?? _computeLocalAnalytics();
  bool get isPro => _isPro;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  int get activeItemsCount => _items.where((i) => i.status == ItemStatus.active).length;
  int get maxFreeItems => 7;

  Future<void> initializeDefaultData() async {
    if (_items.isNotEmpty) return;
    final now = DateTime.now();
    _items = [
      TrackedItem(
        id: 'item-1',
        title: 'Netflix Premium',
        category: Category.subscription,
        amount: 186000,
        billingCycle: BillingCycle.monthly,
        nextDueDate: now.add(const Duration(days: 2)),
        reminderDaysBefore: const [7, 3, 1],
        status: ItemStatus.active,
        attachments: const [
          AttachmentItem(
            id: 'att-1',
            fileName: 'netflix_invoice_march.pdf',
            viewUrl: 'https://storage.dueguard.com/invoice.pdf',
            mimeType: 'application/pdf',
          ),
        ],
      ),
      TrackedItem(
        id: 'item-2',
        title: 'Spotify Family',
        category: Category.subscription,
        amount: 86900,
        billingCycle: BillingCycle.monthly,
        nextDueDate: now.add(const Duration(days: 9)),
        reminderDaysBefore: const [7, 3, 1],
        status: ItemStatus.active,
      ),
      TrackedItem(
        id: 'item-3',
        title: 'STNK 5-Year Renewal',
        category: Category.billId,
        amount: 3500000,
        billingCycle: BillingCycle.yearly,
        nextDueDate: now.add(const Duration(days: 42)),
        reminderDaysBefore: const [30, 14, 7, 3, 1],
        status: ItemStatus.active,
      ),
      TrackedItem(
        id: 'item-4',
        title: 'MacBook Pro Warranty (AppleCare+)',
        category: Category.warranty,
        amount: 3899000,
        billingCycle: BillingCycle.oneTime,
        nextDueDate: now.add(const Duration(days: 85)),
        reminderDaysBefore: const [30, 14, 7],
        status: ItemStatus.active,
      ),
      TrackedItem(
        id: 'item-5',
        title: 'BPJS Kesehatan Mandiri',
        category: Category.billId,
        amount: 150000,
        billingCycle: BillingCycle.monthly,
        nextDueDate: now.add(const Duration(days: 12)),
        reminderDaysBefore: const [7, 3, 1],
        status: ItemStatus.active,
      ),
    ];
    notifyListeners();
  }

  Future<void> fetchItems() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final remoteItems = await itemsRepository.getItems();
      if (remoteItems.isNotEmpty) {
        _items = remoteItems;
      } else if (_items.isEmpty) {
        await initializeDefaultData();
      }
    } catch (e) {
      // Graceful fallback to offline/seeded items
      if (_items.isEmpty) {
        await initializeDefaultData();
      }
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchAnalytics() async {
    try {
      _analytics = await analyticsRepository.getSummary();
      notifyListeners();
    } catch (_) {
      _analytics = _computeLocalAnalytics();
      notifyListeners();
    }
  }

  Future<void> addItem(TrackedItem item) async {
    _items.add(item);
    notifyListeners();

    try {
      await itemsRepository.createItem(item);
    } catch (_) {
      // Kept in local state if offline
    }
  }

  Future<TrackedItem> renewItem(TrackedItem item) async {
    final nextDate = RenewalCalculator.calculateNextDueDate(item.billingCycle, item.nextDueDate);
    final status = item.billingCycle == BillingCycle.oneTime ? ItemStatus.archived : ItemStatus.active;

    final updated = TrackedItem(
      id: item.id,
      title: item.title,
      category: item.category,
      amount: item.amount,
      billingCycle: item.billingCycle,
      nextDueDate: nextDate,
      reminderDaysBefore: item.reminderDaysBefore,
      notes: item.notes,
      templateKey: item.templateKey,
      status: status,
      attachments: item.attachments,
    );

    final idx = _items.indexWhere((i) => i.id == item.id);
    if (idx != -1) {
      _items[idx] = updated;
      notifyListeners();
    }

    try {
      await itemsRepository.renewItem(item.id);
    } catch (_) {
      // Kept locally
    }

    return updated;
  }

  void rollbackItem(TrackedItem item) {
    final idx = _items.indexWhere((i) => i.id == item.id);
    if (idx != -1) {
      _items[idx] = item;
      notifyListeners();
    }
  }

  Future<void> deleteItem(String id) async {
    _items.removeWhere((i) => i.id == id);
    notifyListeners();

    try {
      await itemsRepository.deleteItem(id);
    } catch (_) {
      // Kept locally
    }
  }

  void setPro(bool isPro) {
    _isPro = isPro;
    notifyListeners();
  }

  void clearAll() {
    _items.clear();
    _analytics = null;
    notifyListeners();
  }

  AnalyticsSummary _computeLocalAnalytics() {
    double monthly = 0;
    for (final item in _items) {
      if (item.amount == null || item.status != ItemStatus.active) continue;
      switch (item.billingCycle) {
        case BillingCycle.monthly:
          monthly += item.amount!;
          break;
        case BillingCycle.yearly:
          monthly += item.amount! / 12.0;
          break;
        case BillingCycle.quarterly:
          monthly += item.amount! / 3.0;
          break;
        case BillingCycle.oneTime:
          break;
      }
    }

    return AnalyticsSummary(
      estMonthlySpend: monthly,
      annualizedSpend: monthly * 12.0,
      dueThisMonth: monthly,
      upcoming90DaysSpikes: const [
        CashSpike(
          month: 'April 2026',
          amount: 3500000,
          diffFromAverage: 3200000,
          reasons: ['STNK 5-Year Renewal'],
        ),
      ],
      categoryBreakdown: const CategoryBreakdown(
        subscriptionPercentage: 62,
        warrantyPercentage: 15,
        billIdPercentage: 23,
      ),
    );
  }
}
