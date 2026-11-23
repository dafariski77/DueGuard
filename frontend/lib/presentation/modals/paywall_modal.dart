import 'package:flutter/material.dart';
import '../../core/theme/due_theme.dart';
import '../widgets/bento_card.dart';
import '../widgets/due_button.dart';

enum ProPlan {
  annual,
  monthly,
}

class PaywallModal extends StatefulWidget {
  final ValueChanged<ProPlan> onSubscribe;
  final VoidCallback onRestore;
  final VoidCallback onClose;

  const PaywallModal({
    super.key,
    required this.onSubscribe,
    required this.onRestore,
    required this.onClose,
  });

  @override
  State<PaywallModal> createState() => _PaywallModalState();
}

class _PaywallModalState extends State<PaywallModal> {
  ProPlan _selectedPlan = ProPlan.annual;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? DueColors.canvasDark : DueColors.canvas,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.close_rounded),
          onPressed: widget.onClose,
        ),
        actions: [
          TextButton(
            onPressed: widget.onRestore,
            child: Text(
              'Restore',
              style: TextStyle(
                fontSize: 14,
                color: isDark ? DueColors.primaryDark : DueColors.primary,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 8.0),
        children: [
          // 1. Pro Hero Badge
          Center(
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDark ? DueColors.primarySoftDark : DueColors.primarySoft,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.star_rounded,
                size: 40,
                color: DueColors.primary,
              ),
            ),
          ),
          const SizedBox(height: 16),
          Center(
            child: Text(
              'Unlock DueGuard Pro',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.w800,
                color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
                letterSpacing: -0.5,
              ),
            ),
          ),
          const SizedBox(height: 8),
          Center(
            child: Text(
              'Unlimited items, OCR auto-scan & Cloud backup',
              style: TextStyle(
                fontSize: 14,
                color: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(height: 24),

          // 2. Plan Selectors
          // Annual Plan
          GestureDetector(
            onTap: () => setState(() => _selectedPlan = ProPlan.annual),
            child: BentoCard(
              variant: _selectedPlan == ProPlan.annual ? BentoVariant.highlight : BentoVariant.standard,
              border: Border.all(
                color: _selectedPlan == ProPlan.annual
                    ? DueColors.primary
                    : (isDark ? DueColors.borderSubtleDark : DueColors.borderSubtle),
                width: _selectedPlan == ProPlan.annual ? 2.0 : 1.0,
              ),
              child: Row(
                children: [
                  Icon(
                    _selectedPlan == ProPlan.annual
                        ? Icons.radio_button_checked_rounded
                        : Icons.radio_button_off_rounded,
                    color: _selectedPlan == ProPlan.annual ? DueColors.primary : DueColors.textMuted,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              'Annual Plan',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                                color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: DueColors.safeBg,
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: const Text(
                                '7-Day Free Trial',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w700,
                                  color: DueColors.safeText,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Rp 249.000 / year',
                          style: TextStyle(
                            fontSize: 13,
                            color: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),

          // Monthly Plan
          GestureDetector(
            onTap: () => setState(() => _selectedPlan = ProPlan.monthly),
            child: BentoCard(
              variant: _selectedPlan == ProPlan.monthly ? BentoVariant.highlight : BentoVariant.standard,
              border: Border.all(
                color: _selectedPlan == ProPlan.monthly
                    ? DueColors.primary
                    : (isDark ? DueColors.borderSubtleDark : DueColors.borderSubtle),
                width: _selectedPlan == ProPlan.monthly ? 2.0 : 1.0,
              ),
              child: Row(
                children: [
                  Icon(
                    _selectedPlan == ProPlan.monthly
                        ? Icons.radio_button_checked_rounded
                        : Icons.radio_button_off_rounded,
                    color: _selectedPlan == ProPlan.monthly ? DueColors.primary : DueColors.textMuted,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Monthly Plan',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Rp 29.000 / month',
                          style: TextStyle(
                            fontSize: 13,
                            color: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),

          // 3. Pro Features List
          BentoCard(
            child: Column(
              children: [
                _buildFeatureRow('Unlimited items & categories (free limited to 7)', isDark),
                const SizedBox(height: 10),
                _buildFeatureRow('Unlimited Proof Vault storage for receipts & IDs', isDark),
                const SizedBox(height: 10),
                _buildFeatureRow('Smart multi-stage notifications (30d, 14d, 7d, 3d, 1d)', isDark),
                const SizedBox(height: 10),
                _buildFeatureRow('90-day predictive cash spike radar', isDark),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // 4. Primary CTA Button (44pt HIG minimum height)
          DueButton(
            title: _selectedPlan == ProPlan.annual ? 'Start 7-Day Free Trial' : 'Subscribe Now',
            onPressed: () => widget.onSubscribe(_selectedPlan),
          ),
          const SizedBox(height: 12),
          Center(
            child: Text(
              'Recurring billing. Cancel anytime in Apple App Store Settings.',
              style: TextStyle(
                fontSize: 11,
                color: isDark ? DueColors.textMutedDark : DueColors.textMuted,
              ),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeatureRow(String text, bool isDark) {
    return Row(
      children: [
        const Icon(Icons.check_circle_rounded, size: 18, color: DueColors.safeText),
        const SizedBox(width: 10),
        Expanded(
          child: Text(
            text,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
            ),
          ),
        ),
      ],
    );
  }
}
