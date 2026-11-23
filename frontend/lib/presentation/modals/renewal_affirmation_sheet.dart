import 'dart:async';
import 'package:flutter/material.dart';
import '../../core/theme/due_theme.dart';
import '../widgets/due_button.dart';

class RenewalAffirmationSheet extends StatefulWidget {
  final String itemTitle;
  final DateTime newDueDate;
  final VoidCallback onUndo;
  final VoidCallback onDismiss;

  const RenewalAffirmationSheet({
    super.key,
    required this.itemTitle,
    required this.newDueDate,
    required this.onUndo,
    required this.onDismiss,
  });

  @override
  State<RenewalAffirmationSheet> createState() => _RenewalAffirmationSheetState();
}

class _RenewalAffirmationSheetState extends State<RenewalAffirmationSheet> {
  int _secondsLeft = 5;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (!mounted) return;
      if (_secondsLeft <= 1) {
        t.cancel();
        widget.onDismiss();
      } else {
        setState(() => _secondsLeft--);
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

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
              color: DueColors.safeBg,
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.check_circle_rounded,
              size: 44,
              color: DueColors.safeText,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Item Renewed!',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w800,
              color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Next due date: ${widget.newDueDate.day}/${widget.newDueDate.month}/${widget.newDueDate.year}',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
            ),
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(
                child: DueButton(
                  title: 'Undo (${_secondsLeft}s)',
                  onPressed: () {
                    _timer?.cancel();
                    widget.onUndo();
                  },
                  variant: DueButtonVariant.secondary,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: DueButton(
                  title: 'Done',
                  onPressed: () {
                    _timer?.cancel();
                    widget.onDismiss();
                  },
                  variant: DueButtonVariant.primary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
