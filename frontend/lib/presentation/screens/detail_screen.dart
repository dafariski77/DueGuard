import 'package:flutter/material.dart';
import '../../core/theme/due_theme.dart';
import '../../data/models/tracked_item.dart';
import '../widgets/bento_card.dart';
import '../widgets/countdown_badge.dart';
import '../widgets/due_button.dart';

class DetailScreen extends StatelessWidget {
  final TrackedItem item;
  final VoidCallback? onRenew;
  final VoidCallback? onDelete;
  final VoidCallback? onEdit;
  final VoidCallback? onAddAttachment;

  const DetailScreen({
    super.key,
    required this.item,
    this.onRenew,
    this.onDelete,
    this.onEdit,
    this.onAddAttachment,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? DueColors.canvasDark : DueColors.canvas,
      appBar: AppBar(
        title: Text(
          item.title,
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
          ),
        ),
        actions: [
          if (onEdit != null)
            IconButton(
              icon: const Icon(Icons.edit_outlined),
              onPressed: onEdit,
            ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16.0),
        children: [
          // 1. Digital Pass Hero Card
          BentoCard(
            variant: BentoVariant.hero,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      item.category.displayName.toUpperCase(),
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: DueColors.primary,
                        letterSpacing: 0.5,
                      ),
                    ),
                    CountdownBadge(daysRemaining: item.daysRemaining),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  item.title,
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w800,
                    color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  item.amount != null
                      ? DueTheme.formatCurrency(item.amount!)
                      : 'Free / Variable',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 12),
                Divider(
                  color: isDark ? DueColors.borderSubtleDark : DueColors.borderSubtle,
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Next Due: ${item.nextDueDate.day}/${item.nextDueDate.month}/${item.nextDueDate.year}',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
                      ),
                    ),
                    Text(
                      item.billingCycle.displayName,
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // 2. Specifications Card
          BentoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Specifications',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 12),
                _buildSpecRow('Category', item.category.displayName, isDark),
                const SizedBox(height: 8),
                _buildSpecRow('Billing Cycle', item.billingCycle.displayName, isDark),
                const SizedBox(height: 8),
                _buildSpecRow(
                  'Reminder Intervals',
                  '${item.reminderDaysBefore.map((d) => "${d}d").join(", ")} before',
                  isDark,
                ),
                if (item.notes != null) ...[
                  const SizedBox(height: 8),
                  _buildSpecRow('Notes', item.notes!, isDark),
                ],
              ],
            ),
          ),
          const SizedBox(height: 16),

          // 3. Proof Vault Card
          BentoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Proof Vault (${item.attachments.length}/2)',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
                      ),
                    ),
                    if (onAddAttachment != null)
                      TextButton.icon(
                        icon: const Icon(Icons.add_a_photo_outlined, size: 16),
                        label: const Text('Add Photo', style: TextStyle(fontSize: 12)),
                        onPressed: onAddAttachment,
                      ),
                  ],
                ),
                const SizedBox(height: 8),
                if (item.attachments.isEmpty)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 12.0),
                    child: Text(
                      'No receipts or ID cards attached yet (2 files included with Free tier).',
                      style: TextStyle(
                        fontSize: 12,
                        color: isDark ? DueColors.textMutedDark : DueColors.textMuted,
                      ),
                    ),
                  )
                else
                  ...item.attachments.map((att) {
                    return Container(
                      margin: const EdgeInsets.only(top: 6),
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: isDark ? DueColors.surfaceSubtleDark : DueColors.surfaceSubtle,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.description_outlined, size: 18),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              att.fileName,
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                                color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          const Icon(Icons.chevron_right_rounded, size: 18),
                        ],
                      ),
                    );
                  }),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // 4. Action Buttons (HIG minimum 44pt touch target)
          DueButton(
            title: 'Mark Renewed',
            onPressed: onRenew,
            variant: DueButtonVariant.primary,
          ),
          const SizedBox(height: 8),
          DueButton(
            title: 'Delete Item',
            onPressed: onDelete,
            variant: DueButtonVariant.danger,
          ),
        ],
      ),
    );
  }

  Widget _buildSpecRow(String label, String value, bool isDark) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 13,
            color: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
          ),
        ),
      ],
    );
  }
}
