import 'package:flutter/material.dart';
import '../../core/theme/due_theme.dart';
import '../widgets/bento_card.dart';
import '../widgets/due_button.dart';

class SettingsScreen extends StatefulWidget {
  final String userEmail;
  final bool isPro;
  final VoidCallback? onUpgradePro;
  final VoidCallback? onRestorePurchases;
  final VoidCallback? onDeleteAccount;
  final ValueChanged<bool>? onToggleBiometric;
  final ValueChanged<bool>? onToggleNotifications;

  const SettingsScreen({
    super.key,
    required this.userEmail,
    this.isPro = false,
    this.onUpgradePro,
    this.onRestorePurchases,
    this.onDeleteAccount,
    this.onToggleBiometric,
    this.onToggleNotifications,
  });

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _biometricEnabled = true;
  bool _notificationsEnabled = true;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? DueColors.canvasDark : DueColors.canvas,
      appBar: AppBar(
        title: Text(
          'Account & Security',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
            letterSpacing: -0.4,
          ),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16.0),
        children: [
          // 1. User Profile Bento Card
          BentoCard(
            child: Row(
              children: [
                CircleAvatar(
                  radius: 22,
                  backgroundColor: isDark ? DueColors.primarySoftDark : DueColors.primarySoft,
                  child: const Icon(Icons.person_rounded, color: DueColors.primary),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.userEmail,
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                          color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        widget.isPro ? 'DueGuard Pro Member' : 'Free Tier (Up to 7 Items)',
                        style: TextStyle(
                          fontSize: 12,
                          color: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: widget.isPro
                        ? (isDark ? DueColors.safeBgDark : DueColors.safeBg)
                        : (isDark ? DueColors.surfaceSubtleDark : DueColors.surfaceSubtle),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    widget.isPro ? 'PRO' : 'FREE',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: widget.isPro
                          ? (isDark ? DueColors.safeTextDark : DueColors.safeText)
                          : (isDark ? DueColors.textSecondaryDark : DueColors.textSecondary),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // 2. Preferences Card
          BentoCard(
            child: Column(
              children: [
                SwitchListTile.adaptive(
                  contentPadding: EdgeInsets.zero,
                  title: Text(
                    'Face ID / Biometric Lock',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
                    ),
                  ),
                  value: _biometricEnabled,
                  activeTrackColor: DueColors.primary,
                  onChanged: (val) {
                    setState(() => _biometricEnabled = val);
                    widget.onToggleBiometric?.call(val);
                  },
                ),
                Divider(
                  height: 1,
                  color: isDark ? DueColors.borderSubtleDark : DueColors.borderSubtle,
                ),
                SwitchListTile.adaptive(
                  contentPadding: EdgeInsets.zero,
                  title: Text(
                    'Push Notifications',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
                    ),
                  ),
                  value: _notificationsEnabled,
                  activeTrackColor: DueColors.primary,
                  onChanged: (val) {
                    setState(() => _notificationsEnabled = val);
                    widget.onToggleNotifications?.call(val);
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // 3. Purchase & Subscription
          BentoCard(
            child: Column(
              children: [
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: Text(
                    'Restore Purchases',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
                    ),
                  ),
                  trailing: const Icon(Icons.chevron_right_rounded, size: 20),
                  onTap: widget.onRestorePurchases,
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),

          // 4. Apple App Store Guideline 5.1.1(v) Account Deletion
          DueButton(
            title: 'Delete Account',
            onPressed: widget.onDeleteAccount,
            variant: DueButtonVariant.danger,
          ),
        ],
      ),
    );
  }
}
