import 'package:flutter/material.dart';
import '../../core/theme/due_theme.dart';

class CountdownBadge extends StatelessWidget {
  final int daysRemaining;
  final bool? isDark;

  const CountdownBadge({
    super.key,
    required this.daysRemaining,
    this.isDark,
  });

  @override
  Widget build(BuildContext context) {
    final darkMode = isDark ?? (Theme.of(context).brightness == Brightness.dark);
    final tokens = DueTheme.getUrgencyTokens(daysRemaining, isDark: darkMode);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
      decoration: BoxDecoration(
        color: tokens.bg,
        borderRadius: BorderRadius.circular(6.0),
      ),
      child: Text(
        tokens.label,
        style: TextStyle(
          color: tokens.text,
          fontSize: 11.0,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.5,
          fontFeatures: const [FontFeature.tabularFigures()],
        ),
      ),
    );
  }
}
