import 'package:flutter/material.dart';
import '../../core/theme/due_theme.dart';
import '../../data/models/analytics_summary.dart';
import '../widgets/bento_card.dart';

class SpendRadarScreen extends StatelessWidget {
  final AnalyticsSummary analytics;

  const SpendRadarScreen({
    super.key,
    required this.analytics,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? DueColors.canvasDark : DueColors.canvas,
      appBar: AppBar(
        title: Text(
          'Spend Radar',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w700,
            color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
            letterSpacing: -0.5,
          ),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
        children: [
          // 1. Run-Rate Hero Bento Card
          BentoCard(
            variant: BentoVariant.hero,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Est. Monthly Run-Rate',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  DueTheme.formatCurrency(analytics.estMonthlySpend),
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.w800,
                    color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
                    fontFeatures: const [FontFeature.tabularFigures()],
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Annualized: ${DueTheme.formatCurrency(analytics.annualizedSpend)}',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    color: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // 2. Upcoming 90-Day Cash Spikes
          Text(
            'Upcoming 90-Day Cash Spikes',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
            ),
          ),
          const SizedBox(height: 8),

          if (analytics.upcoming90DaysSpikes.isEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 24.0),
              child: Center(
                child: Text(
                  'No cash spikes detected in the next 90 days.',
                  style: TextStyle(
                    fontSize: 13,
                    color: isDark ? DueColors.textMutedDark : DueColors.textMuted,
                  ),
                ),
              ),
            )
          else
            ...analytics.upcoming90DaysSpikes.map((spike) {
              final reasonText = spike.reasons.isNotEmpty
                  ? spike.reasons.first
                  : 'Spike in ${spike.month}';
              return Padding(
                padding: const EdgeInsets.only(bottom: 8.0),
                child: BentoCard(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              reasonText,
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w600,
                                color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              spike.month,
                              style: TextStyle(
                                fontSize: 12,
                                color: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Text(
                        DueTheme.formatCurrency(spike.amount),
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: isDark ? DueColors.criticalTextDark : DueColors.criticalText,
                          fontFeatures: const [FontFeature.tabularFigures()],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }),
          const SizedBox(height: 16),

          // 3. Category Distribution Card
          BentoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Category Distribution',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 14),
                _buildCategoryBar(
                  'Subscriptions',
                  analytics.categoryBreakdown.subscriptionPercentage,
                  DueColors.subscriptionText,
                  isDark,
                ),
                const SizedBox(height: 10),
                _buildCategoryBar(
                  'Warranties',
                  analytics.categoryBreakdown.warrantyPercentage,
                  DueColors.warrantyText,
                  isDark,
                ),
                const SizedBox(height: 10),
                _buildCategoryBar(
                  'Bills & Civic IDs',
                  analytics.categoryBreakdown.billIdPercentage,
                  DueColors.billIdText,
                  isDark,
                ),
              ],
            ),
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildCategoryBar(String label, int percentage, Color color, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              label,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
              ),
            ),
            Text(
              '$percentage%',
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
              ),
            ),
          ],
        ),
        const SizedBox(height: 6),
        ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: LinearProgressIndicator(
            value: percentage / 100.0,
            backgroundColor: isDark ? DueColors.surfaceSubtleDark : DueColors.surfaceSubtle,
            valueColor: AlwaysStoppedAnimation<Color>(color),
            minHeight: 6,
          ),
        ),
      ],
    );
  }
}
