import 'package:flutter/material.dart';
import '../../core/theme/due_theme.dart';

enum BentoVariant {
  standard,
  hero,
  highlight,
}

class BentoCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final VoidCallback? onTap;
  final Color? backgroundColor;
  final Border? border;
  final double borderRadius;
  final BentoVariant variant;

  const BentoCard({
    super.key,
    required this.child,
    this.padding,
    this.onTap,
    this.backgroundColor,
    this.border,
    this.borderRadius = 16.0,
    this.variant = BentoVariant.standard,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    Color defaultBg;
    switch (variant) {
      case BentoVariant.hero:
        defaultBg = isDark ? DueColors.surfaceDark : DueColors.surface;
        break;
      case BentoVariant.highlight:
        defaultBg = isDark ? DueColors.primarySoftDark : DueColors.primarySoft;
        break;
      case BentoVariant.standard:
        defaultBg = isDark ? DueColors.surfaceDark : DueColors.surface;
        break;
    }

    final borderColor = isDark ? DueColors.borderSubtleDark : DueColors.borderSubtle;
    final side = BorderSide(color: borderColor, width: 1.0);

    Widget inner = Padding(
      padding: padding ?? const EdgeInsets.all(16.0),
      child: child,
    );

    if (onTap != null) {
      inner = InkWell(
        borderRadius: BorderRadius.circular(borderRadius),
        onTap: onTap,
        child: inner,
      );
    }

    return Material(
      color: backgroundColor ?? defaultBg,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(borderRadius),
        side: side,
      ),
      child: inner,
    );
  }
}
