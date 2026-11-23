import 'package:flutter/material.dart';
import '../../core/theme/due_theme.dart';
import '../widgets/due_button.dart';

class DeleteConsentDialog extends StatelessWidget {
  final VoidCallback onConfirmDelete;
  final VoidCallback onCancel;

  const DeleteConsentDialog({
    super.key,
    required this.onConfirmDelete,
    required this.onCancel,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: const EdgeInsets.all(24.0),
      decoration: BoxDecoration(
        color: isDark ? DueColors.surfaceDark : DueColors.surface,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: DueColors.criticalBg,
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.warning_amber_rounded,
              size: 40,
              color: DueColors.criticalText,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Delete Account?',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w800,
              color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'This action cannot be undone. All your tracked items, uploaded receipts, and analytics will be permanently deleted from our servers immediately in compliance with Apple App Store Guideline 5.1.1(v).',
            style: TextStyle(
              fontSize: 13,
              color: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          DueButton(
            title: 'Permanently Delete',
            onPressed: onConfirmDelete,
            variant: DueButtonVariant.danger,
          ),
          const SizedBox(height: 8),
          DueButton(
            title: 'Cancel',
            onPressed: onCancel,
            variant: DueButtonVariant.ghost,
          ),
        ],
      ),
    );
  }
}
