import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dueguard/data/models/enums.dart';
import 'package:dueguard/data/models/tracked_item.dart';
import 'package:dueguard/data/models/analytics_summary.dart';
import 'package:dueguard/presentation/screens/home_screen.dart';
import 'package:dueguard/presentation/screens/quick_add_screen.dart';
import 'package:dueguard/presentation/screens/detail_screen.dart';
import 'package:dueguard/presentation/screens/spend_radar_screen.dart';
import 'package:dueguard/presentation/screens/settings_screen.dart';

void main() {
  final sampleItem = TrackedItem(
    id: 'item-1',
    title: 'Netflix Premium',
    category: Category.subscription,
    amount: 186000,
    billingCycle: BillingCycle.monthly,
    nextDueDate: DateTime.now().add(const Duration(days: 2)),
    reminderDaysBefore: [7, 3, 1],
    status: ItemStatus.active,
    attachments: const [
      AttachmentItem(
        id: 'att-1',
        fileName: 'receipt_march.pdf',
        viewUrl: 'https://storage.dueguard.com/receipt_march.pdf',
        mimeType: 'application/pdf',
      ),
    ],
  );

  final sampleAnalytics = AnalyticsSummary(
    estMonthlySpend: 186000,
    annualizedSpend: 2232000,
    dueThisMonth: 186000,
    upcoming90DaysSpikes: [
      CashSpike(
        month: 'April 2026',
        amount: 3500000,
        diffFromAverage: 3300000,
        reasons: ['STNK 5-Year Renewal'],
      ),
    ],
    categoryBreakdown: const CategoryBreakdown(
      subscriptionPercentage: 60,
      warrantyPercentage: 0,
      billIdPercentage: 40,
    ),
  );

  group('Core Screen 1: HomeScreen', () {
    testWidgets('renders hero item, burn cards, category chips, and add button', (tester) async {
      tester.view.physicalSize = const Size(1000, 3000);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(
        MaterialApp(
          home: HomeScreen(
            items: [sampleItem],
            analytics: sampleAnalytics,
            activeItemsCount: 5,
            maxFreeItems: 7,
            onAddItem: () {},
            onTapItem: (item) {},
          ),
        ),
      );

      expect(find.text('Upcoming'), findsOneWidget);
      expect(find.text('Netflix Premium'), findsWidgets);
      expect(find.text('2D LEFT'), findsWidgets);
      expect(find.text('Rp 186.000'), findsWidgets);
      expect(find.text('5/7 Slots'), findsOneWidget);
      expect(find.text('All'), findsOneWidget);
      expect(find.text('Subscriptions'), findsWidgets);
    });
  });

  group('Core Screen 2: QuickAddScreen', () {
    testWidgets('renders template picker, title input, category selector, and save button', (tester) async {
      tester.view.physicalSize = const Size(1000, 3000);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      TrackedItem? savedItem;
      await tester.pumpWidget(
        MaterialApp(
          home: QuickAddScreen(
            onSave: (item) {
              savedItem = item;
            },
            onCancel: () {},
          ),
        ),
      );

      expect(find.text('Add Due Item'), findsOneWidget);
      expect(find.text('Quick Templates'), findsOneWidget);
      expect(find.text('Save Item'), findsOneWidget);

      // Select template chip
      await tester.tap(find.text('Spotify').first);
      await tester.pumpAndSettle();

      // Tap Save
      await tester.ensureVisible(find.text('Save Item'));
      await tester.tap(find.text('Save Item'));
      await tester.pumpAndSettle();

      expect(savedItem, isNotNull);
      expect(savedItem!.title, 'Spotify');
    });
  });

  group('Core Screen 3: DetailScreen', () {
    testWidgets('renders digital pass, specs, proof vault gallery, and renew action', (tester) async {
      tester.view.physicalSize = const Size(1000, 3000);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      bool renewed = false;
      bool deleted = false;
      await tester.pumpWidget(
        MaterialApp(
          home: DetailScreen(
            item: sampleItem,
            onRenew: () {
              renewed = true;
            },
            onDelete: () {
              deleted = true;
            },
          ),
        ),
      );

      expect(find.text('Netflix Premium'), findsWidgets);
      expect(find.text('Mark Renewed'), findsOneWidget);
      expect(find.text('Proof Vault (1/2)'), findsOneWidget);
      expect(find.text('receipt_march.pdf'), findsOneWidget);

      await tester.tap(find.text('Mark Renewed'));
      await tester.pump();
      expect(renewed, isTrue);

      await tester.ensureVisible(find.text('Delete Item'));
      await tester.tap(find.text('Delete Item'));
      await tester.pump();
      expect(deleted, isTrue);
    });
  });

  group('Core Screen 4: SpendRadarScreen', () {
    testWidgets('renders monthly burn rate, cash spike card, and category breakdown', (tester) async {
      tester.view.physicalSize = const Size(1000, 3000);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(
        MaterialApp(
          home: SpendRadarScreen(
            analytics: sampleAnalytics,
          ),
        ),
      );

      expect(find.text('Spend Radar'), findsOneWidget);
      expect(find.text('Est. Monthly Run-Rate'), findsOneWidget);
      expect(find.text('STNK 5-Year Renewal'), findsOneWidget);
      expect(find.text('Rp 3.500.000'), findsOneWidget);
      expect(find.text('Category Distribution'), findsOneWidget);
    });
  });

  group('Core Screen 5: SettingsScreen', () {
    testWidgets('renders profile, biometric switch, push switch, and delete account button', (tester) async {
      tester.view.physicalSize = const Size(1000, 3000);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      bool deleteTriggered = false;
      await tester.pumpWidget(
        MaterialApp(
          home: SettingsScreen(
            userEmail: 'user@example.com',
            isPro: false,
            onDeleteAccount: () {
              deleteTriggered = true;
            },
          ),
        ),
      );

      expect(find.text('Account & Security'), findsOneWidget);
      expect(find.text('user@example.com'), findsOneWidget);
      expect(find.text('Face ID / Biometric Lock'), findsOneWidget);
      expect(find.text('Push Notifications'), findsOneWidget);
      expect(find.text('Delete Account'), findsOneWidget);

      await tester.ensureVisible(find.text('Delete Account'));
      await tester.tap(find.text('Delete Account'));
      await tester.pump();
      expect(deleteTriggered, isTrue);
    });
  });
}
