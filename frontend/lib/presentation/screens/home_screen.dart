import 'package:flutter/material.dart';
import '../../core/theme/due_theme.dart';
import '../../data/models/enums.dart';
import '../../data/models/tracked_item.dart';
import '../../data/models/analytics_summary.dart';
import '../widgets/bento_card.dart';
import '../widgets/countdown_badge.dart';

class HomeScreen extends StatefulWidget {
  final List<TrackedItem> items;
  final AnalyticsSummary? analytics;
  final int activeItemsCount;
  final int maxFreeItems;
  final VoidCallback onAddItem;
  final ValueChanged<TrackedItem> onTapItem;
  final Future<void> Function()? onRefresh;

  const HomeScreen({
    super.key,
    required this.items,
    this.analytics,
    this.activeItemsCount = 0,
    this.maxFreeItems = 7,
    required this.onAddItem,
    required this.onTapItem,
    this.onRefresh,
  });

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  Category? _selectedCategory;

  List<TrackedItem> get _filteredItems {
    if (_selectedCategory == null) return widget.items;
    return widget.items.where((i) => i.category == _selectedCategory).toList();
  }

  TrackedItem? get _nearestDueItem {
    if (widget.items.isEmpty) return null;
    final sorted = List<TrackedItem>.from(widget.items)
      ..sort((a, b) => a.nextDueDate.compareTo(b.nextDueDate));
    return sorted.first;
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final nearest = _nearestDueItem;

    return Scaffold(
      backgroundColor: isDark ? DueColors.canvasDark : DueColors.canvas,
      appBar: AppBar(
        title: Text(
          'Upcoming',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w700,
            color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
            letterSpacing: -0.5,
          ),
        ),
        actions: [
          IconButton(
            icon: Icon(
              Icons.notifications_none_rounded,
              color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
            ),
            onPressed: () {},
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: widget.onRefresh ?? () async {},
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
          children: [
            // 1. Hero Card (Nearest Due Item)
            if (nearest != null) ...[
              BentoCard(
                variant: BentoVariant.hero,
                onTap: () => widget.onTapItem(nearest),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Flexible(
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: isDark ? DueColors.primarySoftDark : DueColors.primarySoft,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              nearest.category.displayName.toUpperCase(),
                              style: const TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w700,
                                color: DueColors.primary,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        CountdownBadge(daysRemaining: nearest.daysRemaining),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(
                      nearest.title,
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                        color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          nearest.amount != null
                              ? DueTheme.formatCurrency(nearest.amount!)
                              : 'Variable / Free',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                            color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
                          ),
                        ),
                        Text(
                          'Due in ${nearest.daysRemaining} days',
                          style: TextStyle(
                            fontSize: 13,
                            color: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
            ],

            // 2. Split Burn Cards Row
            Row(
              children: [
                Expanded(
                  child: BentoCard(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Est. Monthly Spend',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                            color: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          DueTheme.formatCurrency(widget.analytics?.estMonthlySpend ?? 0),
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: BentoCard(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Storage Tier',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                            color: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          '${widget.activeItemsCount}/${widget.maxFreeItems} Slots',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: widget.activeItemsCount >= widget.maxFreeItems
                                ? (isDark ? DueColors.warningTextDark : DueColors.warningText)
                                : (isDark ? DueColors.textPrimaryDark : DueColors.textPrimary),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // 3. Category Filter Chips
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _buildFilterChip('All', _selectedCategory == null, () {
                    setState(() => _selectedCategory = null);
                  }),
                  const SizedBox(width: 8),
                  _buildFilterChip(
                    'Subscriptions',
                    _selectedCategory == Category.subscription,
                    () => setState(() => _selectedCategory = Category.subscription),
                  ),
                  const SizedBox(width: 8),
                  _buildFilterChip(
                    'Warranties',
                    _selectedCategory == Category.warranty,
                    () => setState(() => _selectedCategory = Category.warranty),
                  ),
                  const SizedBox(width: 8),
                  _buildFilterChip(
                    'Bills & IDs',
                    _selectedCategory == Category.billId,
                    () => setState(() => _selectedCategory = Category.billId),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // 4. Timeline List of Filtered Items
            Text(
              'Timeline',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
              ),
            ),
            const SizedBox(height: 8),

            if (_filteredItems.isEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 32.0),
                child: Center(
                  child: Text(
                    'No items in this category',
                    style: TextStyle(
                      color: isDark ? DueColors.textMutedDark : DueColors.textMuted,
                      fontSize: 14,
                    ),
                  ),
                ),
              )
            else
              ..._filteredItems.map((item) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 8.0),
                  child: BentoCard(
                    onTap: () => widget.onTapItem(item),
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item.title,
                                style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w600,
                                  color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                item.amount != null
                                    ? DueTheme.formatCurrency(item.amount!)
                                    : 'Free / Variable',
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w500,
                                  color: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
                                ),
                              ),
                            ],
                          ),
                        ),
                        CountdownBadge(daysRemaining: item.daysRemaining),
                      ],
                    ),
                  ),
                );
              }),
            const SizedBox(height: 80),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: widget.onAddItem,
        backgroundColor: isDark ? DueColors.primaryDark : DueColors.primary,
        icon: const Icon(Icons.add_rounded, color: Colors.white),
        label: const Text(
          '+ Add Due Item',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
        ),
      ),
    );
  }

  Widget _buildFilterChip(String label, bool isSelected, VoidCallback onTap) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected
              ? (isDark ? DueColors.primaryDark : DueColors.primary)
              : (isDark ? DueColors.surfaceDark : DueColors.surface),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected
                ? Colors.transparent
                : (isDark ? DueColors.borderSubtleDark : DueColors.borderSubtle),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 13,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
            color: isSelected
                ? Colors.white
                : (isDark ? DueColors.textSecondaryDark : DueColors.textSecondary),
          ),
        ),
      ),
    );
  }
}
