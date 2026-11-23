import 'package:flutter/material.dart';
import '../../core/theme/due_theme.dart';

enum DueButtonVariant {
  primary,
  secondary,
  ghost,
  danger,
}

class DueButton extends StatelessWidget {
  final String title;
  final VoidCallback? onPressed;
  final bool isLoading;
  final DueButtonVariant variant;
  final IconData? icon;
  final double? width;
  final double height;

  const DueButton({
    super.key,
    required this.title,
    this.onPressed,
    this.isLoading = false,
    this.variant = DueButtonVariant.primary,
    this.icon,
    this.width,
    this.height = 48.0,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    Color bg;
    Color fg;
    BorderSide border = BorderSide.none;

    switch (variant) {
      case DueButtonVariant.primary:
        bg = isDark ? DueColors.primaryDark : DueColors.primary;
        fg = Colors.white;
        break;
      case DueButtonVariant.secondary:
        bg = isDark ? DueColors.surfaceSubtleDark : DueColors.surfaceSubtle;
        fg = isDark ? DueColors.textPrimaryDark : DueColors.textPrimary;
        border = BorderSide(
          color: isDark ? DueColors.borderSubtleDark : DueColors.borderSubtle,
        );
        break;
      case DueButtonVariant.ghost:
        bg = Colors.transparent;
        fg = isDark ? DueColors.primaryDark : DueColors.primary;
        break;
      case DueButtonVariant.danger:
        bg = isDark ? DueColors.criticalBgDark : DueColors.criticalBg;
        fg = isDark ? DueColors.criticalTextDark : DueColors.criticalText;
        break;
    }

    Widget content = isLoading
        ? SizedBox(
            width: 20,
            height: 20,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation<Color>(fg),
            ),
          )
        : Row(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (icon != null) ...[
                Icon(icon, size: 18, color: fg),
                const SizedBox(width: 8),
              ],
              Text(
                title,
                style: TextStyle(
                  color: fg,
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                  letterSpacing: -0.2,
                ),
              ),
            ],
          );

    return SizedBox(
      width: width,
      height: height < 44.0 ? 44.0 : height, // Enforce HIG minimum 44pt
      child: Material(
        color: bg,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12.0),
          side: border,
        ),
        child: InkWell(
          borderRadius: BorderRadius.circular(12.0),
          onTap: isLoading ? null : onPressed,
          child: Center(child: content),
        ),
      ),
    );
  }
}
