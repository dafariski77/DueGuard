import 'package:flutter/material.dart';
import '../../core/theme/due_theme.dart';

class DueInput extends StatelessWidget {
  final String? label;
  final String? hintText;
  final String? errorText;
  final TextEditingController? controller;
  final TextInputType? keyboardType;
  final bool obscureText;
  final ValueChanged<String>? onChanged;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final bool readOnly;
  final VoidCallback? onTap;

  const DueInput({
    super.key,
    this.label,
    this.hintText,
    this.errorText,
    this.controller,
    this.keyboardType,
    this.obscureText = false,
    this.onChanged,
    this.prefixIcon,
    this.suffixIcon,
    this.readOnly = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (label != null) ...[
          Text(
            label!,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
            ),
          ),
          const SizedBox(height: 6),
        ],
        Container(
          decoration: BoxDecoration(
            color: isDark ? DueColors.surfaceDark : DueColors.surface,
            borderRadius: BorderRadius.circular(10.0),
            border: Border.all(
              color: errorText != null
                  ? (isDark ? DueColors.criticalTextDark : DueColors.criticalText)
                  : (isDark ? DueColors.borderSubtleDark : DueColors.borderSubtle),
              width: 1.0,
            ),
          ),
          child: TextField(
            controller: controller,
            keyboardType: keyboardType,
            obscureText: obscureText,
            onChanged: onChanged,
            readOnly: readOnly,
            onTap: onTap,
            style: TextStyle(
              fontSize: 15,
              color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
            ),
            decoration: InputDecoration(
              hintText: hintText,
              hintStyle: TextStyle(
                color: isDark ? DueColors.textMutedDark : DueColors.textMuted,
                fontSize: 14,
              ),
              prefixIcon: prefixIcon,
              suffixIcon: suffixIcon,
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            ),
          ),
        ),
        if (errorText != null) ...[
          const SizedBox(height: 4),
          Text(
            errorText!,
            style: TextStyle(
              fontSize: 12,
              color: isDark ? DueColors.criticalTextDark : DueColors.criticalText,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ],
    );
  }
}
