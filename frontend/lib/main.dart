import 'package:flutter/material.dart';
import 'core/network/api_client.dart';
import 'core/theme/due_theme.dart';
import 'data/models/tracked_item.dart';
import 'data/repositories/items_repository.dart';
import 'data/repositories/analytics_repository.dart';
import 'presentation/screens/home_screen.dart';
import 'presentation/screens/quick_add_screen.dart';
import 'presentation/screens/detail_screen.dart';
import 'presentation/screens/spend_radar_screen.dart';
import 'presentation/screens/settings_screen.dart';
import 'presentation/modals/paywall_modal.dart';
import 'presentation/modals/renewal_affirmation_sheet.dart';
import 'presentation/modals/delete_consent_dialog.dart';
import 'presentation/viewmodels/items_view_model.dart';

void main() {
  final apiClient = ApiClient(baseUrl: 'http://localhost:3000');
  final itemsRepo = ItemsRepository(apiClient);
  final analyticsRepo = AnalyticsRepository(apiClient);
  final viewModel = ItemsViewModel(
    itemsRepository: itemsRepo,
    analyticsRepository: analyticsRepo,
  );

  runApp(DueGuardApp(viewModel: viewModel));
}

class DueGuardApp extends StatelessWidget {
  final ItemsViewModel? viewModel;

  const DueGuardApp({super.key, this.viewModel});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'DueGuard',
      debugShowCheckedModeBanner: false,
      theme: DueTheme.lightTheme,
      darkTheme: DueTheme.darkTheme,
      themeMode: ThemeMode.system,
      home: RootNavigationContainer(viewModel: viewModel),
    );
  }
}

class RootNavigationContainer extends StatefulWidget {
  final ItemsViewModel? viewModel;

  const RootNavigationContainer({super.key, this.viewModel});

  @override
  State<RootNavigationContainer> createState() => _RootNavigationContainerState();
}

class _RootNavigationContainerState extends State<RootNavigationContainer> {
  int _currentIndex = 0;
  late final ItemsViewModel _viewModel;

  @override
  void initState() {
    super.initState();
    if (widget.viewModel != null) {
      _viewModel = widget.viewModel!;
    } else {
      final apiClient = ApiClient(baseUrl: 'http://localhost:3000');
      _viewModel = ItemsViewModel(
        itemsRepository: ItemsRepository(apiClient),
        analyticsRepository: AnalyticsRepository(apiClient),
      );
    }

    _viewModel.initializeDefaultData();
  }

  void _openQuickAdd() {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (ctx) => QuickAddScreen(
          onSave: (newItem) {
            _viewModel.addItem(newItem);
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
            _viewModel.deleteItem(item.id);
            Navigator.of(ctx).pop();
          },
        ),
      ),
    );
  }

  Future<void> _renewItem(TrackedItem item) async {
    final updated = await _viewModel.renewItem(item);

    if (!mounted) return;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (sheetCtx) => RenewalAffirmationSheet(
        itemTitle: item.title,
        newDueDate: updated.nextDueDate,
        onUndo: () {
          _viewModel.rollbackItem(item);
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
            _viewModel.setPro(true);
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
          _viewModel.clearAll();
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

    return ListenableBuilder(
      listenable: _viewModel,
      builder: (context, _) {
        final screens = [
          HomeScreen(
            items: _viewModel.items,
            analytics: _viewModel.analytics,
            activeItemsCount: _viewModel.activeItemsCount,
            maxFreeItems: _viewModel.maxFreeItems,
            onAddItem: _openQuickAdd,
            onTapItem: _openDetail,
            onRefresh: () async {
              await _viewModel.fetchItems();
              await _viewModel.fetchAnalytics();
            },
          ),
          SpendRadarScreen(
            analytics: _viewModel.analytics!,
          ),
          SettingsScreen(
            userEmail: 'user@example.com',
            isPro: _viewModel.isPro,
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
      },
    );
  }
}
