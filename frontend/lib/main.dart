import 'package:flutter/material.dart';
import 'core/theme/due_theme.dart';
import 'data/models/enums.dart';
import 'data/models/tracked_item.dart';
import 'data/models/analytics_summary.dart';
import 'presentation/screens/home_screen.dart';
import 'presentation/screens/quick_add_screen.dart';
import 'presentation/screens/detail_screen.dart';
import 'presentation/screens/spend_radar_screen.dart';
import 'presentation/screens/settings_screen.dart';
import 'presentation/modals/paywall_modal.dart';
import 'presentation/modals/renewal_affirmation_sheet.dart';
import 'presentation/modals/delete_consent_dialog.dart';

void main() {
  runApp(const DueGuardApp());
}

class DueGuardApp extends StatelessWidget {
  const DueGuardApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'DueGuard',
      debugShowCheckedModeBanner: false,
      theme: DueTheme.lightTheme,
      darkTheme: DueTheme.darkTheme,
      themeMode: ThemeMode.system,
      home: const RootNavigationContainer(),
    );
  }
}

class RootNavigationContainer extends StatefulWidget {
  const RootNavigationContainer({super.key});

  @override
  State<RootNavigationContainer> createState() => _RootNavigationContainerState();
}

class _RootNavigationContainerState extends State<RootNavigationContainer> {
  int _currentIndex = 0;
  bool _isPro = false;

  late List<TrackedItem> _items;

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _items = [
      TrackedItem(
        id: 'item-1',
        title: 'Netflix Premium',
        category: Category.subscription,
        amount: 186000,
        billingCycle: BillingCycle.monthly,
        nextDueDate: now.add(const Duration(days: 2)),
        reminderDaysBefore: [7, 3, 1],
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
        reminderDaysBefore: [7, 3, 1],
        status: ItemStatus.active,
      ),
      TrackedItem(
        id: 'item-3',
        title: 'STNK 5-Year Renewal',
        category: Category.billId,
        amount: 3500000,
        billingCycle: BillingCycle.yearly,
        nextDueDate: now.add(const Duration(days: 42)),
        reminderDaysBefore: [30, 14, 7, 3, 1],
        status: ItemStatus.active,
      ),
      TrackedItem(
        id: 'item-4',
        title: 'MacBook Pro Warranty (AppleCare+)',
        category: Category.warranty,
        amount: 3899000,
        billingCycle: BillingCycle.oneTime,
        nextDueDate: now.add(const Duration(days: 85)),
        reminderDaysBefore: [30, 14, 7],
        status: ItemStatus.active,
      ),
      TrackedItem(
        id: 'item-5',
        title: 'BPJS Kesehatan Mandiri',
        category: Category.billId,
        amount: 150000,
        billingCycle: BillingCycle.monthly,
        nextDueDate: now.add(const Duration(days: 12)),
        reminderDaysBefore: [7, 3, 1],
        status: ItemStatus.active,
      ),
    ];
  }

  AnalyticsSummary get _analytics {
    double monthly = 0;
    for (final item in _items) {
      if (item.amount == null) continue;
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
      upcoming90DaysSpikes: [
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

  void _openQuickAdd() {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (ctx) => QuickAddScreen(
          onSave: (newItem) {
            setState(() {
              _items.add(newItem);
            });
            Navigator.of(ctx).pop();
          },
          onCancel: () => Navigator.of(ctx).pop(),
        ),
      ),
    );
  }

  void _openDetail(TrackedItem item) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (ctx) => DetailScreen(
          item: item,
          onRenew: () {
            Navigator.of(ctx).pop();
            _renewItem(item);
          },
          onDelete: () {
            setState(() {
              _items.removeWhere((i) => i.id == item.id);
            });
            Navigator.of(ctx).pop();
          },
        ),
      ),
    );
  }

  void _renewItem(TrackedItem item) {
    DateTime nextDate;
    switch (item.billingCycle) {
      case BillingCycle.monthly:
        nextDate = DateTime(item.nextDueDate.year, item.nextDueDate.month + 1, item.nextDueDate.day);
        break;
      case BillingCycle.yearly:
        nextDate = DateTime(item.nextDueDate.year + 1, item.nextDueDate.month, item.nextDueDate.day);
        break;
      case BillingCycle.quarterly:
        nextDate = DateTime(item.nextDueDate.year, item.nextDueDate.month + 3, item.nextDueDate.day);
        break;
      case BillingCycle.oneTime:
        nextDate = item.nextDueDate;
        break;
    }

    final oldIndex = _items.indexWhere((i) => i.id == item.id);
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
      status: item.status,
      attachments: item.attachments,
    );

    setState(() {
      if (oldIndex != -1) {
        _items[oldIndex] = updated;
      }
    });

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (sheetCtx) => RenewalAffirmationSheet(
        itemTitle: item.title,
        newDueDate: nextDate,
        onUndo: () {
          setState(() {
            if (oldIndex != -1) {
              _items[oldIndex] = item;
            }
          });
          Navigator.of(sheetCtx).pop();
        },
        onDismiss: () => Navigator.of(sheetCtx).pop(),
      ),
    );
  }

  void _openPaywall() {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (ctx) => PaywallModal(
          onSubscribe: (plan) {
            setState(() => _isPro = true);
            Navigator.of(ctx).pop();
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Welcome to DueGuard Pro!')),
            );
          },
          onRestore: () {
            Navigator.of(ctx).pop();
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Purchases restored.')),
            );
          },
          onClose: () => Navigator.of(ctx).pop(),
        ),
      ),
    );
  }

  void _openDeleteConsent() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) => DeleteConsentDialog(
        onConfirmDelete: () {
          setState(() {
            _items.clear();
          });
          Navigator.of(ctx).pop();
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Account data permanently deleted.')),
          );
        },
        onCancel: () => Navigator.of(ctx).pop(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final screens = [
      HomeScreen(
        items: _items,
        analytics: _analytics,
        activeItemsCount: _items.length,
        maxFreeItems: 7,
        onAddItem: _openQuickAdd,
        onTapItem: _openDetail,
      ),
      SpendRadarScreen(
        analytics: _analytics,
      ),
      SettingsScreen(
        userEmail: 'user@example.com',
        isPro: _isPro,
        onUpgradePro: _openPaywall,
        onRestorePurchases: _openPaywall,
        onDeleteAccount: _openDeleteConsent,
      ),
    ];

    return Scaffold(
      body: screens[_currentIndex],
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          border: Border(
            top: BorderSide(
              color: isDark ? DueColors.borderSubtleDark : DueColors.borderSubtle,
              width: 0.5,
            ),
          ),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) => setState(() => _currentIndex = index),
          selectedItemColor: isDark ? DueColors.primaryDark : DueColors.primary,
          unselectedItemColor: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
          backgroundColor: isDark ? DueColors.surfaceDark : DueColors.surface,
          elevation: 0,
          type: BottomNavigationBarType.fixed,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.calendar_today_rounded),
              label: 'Upcoming',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.radar_rounded),
              label: 'Radar',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.settings_outlined),
              label: 'Control',
            ),
          ],
        ),
      ),
    );
  }
}
