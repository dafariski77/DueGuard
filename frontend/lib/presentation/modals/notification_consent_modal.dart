import 'package:flutter/material.dart';
import '../../core/theme/due_theme.dart';
import '../widgets/bento_card.dart';
import '../widgets/due_button.dart';

class NotificationConsentModal extends StatelessWidget {
  final VoidCallback onAccept;
  final VoidCallback onDismiss;

  const NotificationConsentModal({
    super.key,
    required this.onAccept,
    required this.onDismiss,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? DueColors.canvasDark : DueColors.canvas,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.close_rounded),
          onPressed: onDismiss,
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: isDark ? DueColors.primarySoftDark : DueColors.primarySoft,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.notifications_active_rounded,
                size: 40,
                color: DueColors.primary,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Never Miss a Renewal',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w800,
                color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'DueGuard sends calm, well-timed notifications at strictly scheduled stages so you stay in total control.',
              style: TextStyle(
                fontSize: 13,
                color: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            Expanded(
              child: BentoCard(
                child: ListView(
                  shrinkWrap: true,
                  children: [
                    _buildStageRow('30 days before', 'Time to decide if you want to cancel or budget', isDark),
                    const SizedBox(height: 12),
                    _buildStageRow('7 days before', 'Check balance and payment method', isDark),
                    const SizedBox(height: 12),
                    _buildStageRow('3 days before', 'Urgent alert before billing kicks in', isDark),
                    const SizedBox(height: 12),
                    _buildStageRow('Day of renewal', 'Final confirmation that payment was processed', isDark),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            DueButton(
              title: 'Enable Notifications',
              onPressed: onAccept,
              variant: DueButtonVariant.primary,
            ),
            const SizedBox(height: 8),
            DueButton(
              title: 'Maybe Later',
              onPressed: onDismiss,
              variant: DueButtonVariant.ghost,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStageRow(String stage, String desc, bool isDark) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Icon(Icons.alarm_on_rounded, size: 20, color: DueColors.primary),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                stage,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                desc,
                style: TextStyle(
                  fontSize: 12,
                  color: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
