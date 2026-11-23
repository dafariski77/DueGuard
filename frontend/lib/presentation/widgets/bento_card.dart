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
      default:
        defaultBg = isDark ? DueColors.surfaceDark : DueColors.surface;
    }

    final cardBorder = border ??
        Border.all(
          color: isDark ? DueColors.borderSubtleDark : DueColors.borderSubtle,
          width: 1.0,
        );

    Widget content = Container(
      padding: padding ?? const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: backgroundColor ?? defaultBg,
        borderRadius: BorderRadius.circular(borderRadius),
        border: cardBorder,
      ),
      child: child,
    );

    if (onTap != null) {
      return Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(borderRadius),
        child: InkWell(
          borderRadius: BorderRadius.circular(borderRadius),
          onTap: onTap,
          child: content,
        ),
      );
    }

    return content;
  }
}
