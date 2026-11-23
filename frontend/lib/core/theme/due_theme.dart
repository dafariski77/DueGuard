import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

enum UrgencyLevel {
  critical,
  warning,
  subtle,
}

class UrgencyTokens {
  final UrgencyLevel level;
  final String label;
  final Color text;
  final Color bg;

  const UrgencyTokens({
    required this.level,
    required this.label,
    required this.text,
    required this.bg,
  });
}

class DueColors {
  // Brand & Neutrals (Light Mode)
  static const Color canvas = Color(0xFFF8FAFC);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceSubtle = Color(0xFFF1F5F9);
  static const Color borderSubtle = Color(0xFFE2E8F0);
  static const Color textPrimary = Color(0xFF0F172A);
  static const Color textSecondary = Color(0xFF475569);
  static const Color textMuted = Color(0xFF94A3B8);
  static const Color primary = Color(0xFF4F46E5);
  static const Color primarySoft = Color(0xFFEEF2FF);

  // Brand & Neutrals (Dark Mode)
  static const Color canvasDark = Color(0xFF0B0F19);
  static const Color surfaceDark = Color(0xFF151B2B);
  static const Color surfaceSubtleDark = Color(0xFF1E2638);
  static const Color borderSubtleDark = Color(0xFF263046);
  static const Color textPrimaryDark = Color(0xFFF8FAFC);
  static const Color textSecondaryDark = Color(0xFF94A3B8);
  static const Color textMutedDark = Color(0xFF64748B);
  static const Color primaryDark = Color(0xFF6366F1);
  static const Color primarySoftDark = Color(0xFF1E1B4B);

  // Semantic Urgency (Light Mode)
  static const Color criticalText = Color(0xFFDC2626);
  static const Color criticalBg = Color(0xFFFEF2F2);
  static const Color warningText = Color(0xFFD97706);
  static const Color warningBg = Color(0xFFFFFBEB);
  static const Color safeText = Color(0xFF059669);
  static const Color safeBg = Color(0xFFECFDF5);

  // Semantic Urgency (Dark Mode)
  static const Color criticalTextDark = Color(0xFFF87171);
  static const Color criticalBgDark = Color(0xFF450A0A);
  static const Color warningTextDark = Color(0xFFFBBF24);
  static const Color warningBgDark = Color(0xFF451A03);
  static const Color safeTextDark = Color(0xFF34D399);
  static const Color safeBgDark = Color(0xFF064E3B);

  // Category Accents
  static const Color subscriptionText = Color(0xFF4F46E5);
  static const Color subscriptionBg = Color(0xFFEEF2FF);
  static const Color warrantyText = Color(0xFF0284C7);
  static const Color warrantyBg = Color(0xFFF0F9FF);
  static const Color billIdText = Color(0xFF7C3AED);
  static const Color billIdBg = Color(0xFFF5F3FF);
}

class DueTheme {
  static UrgencyTokens getUrgencyTokens(int daysRemaining, {bool isDark = false}) {
    if (daysRemaining <= 0) {
      final label = daysRemaining == 0 ? 'DUE TODAY' : '${daysRemaining.abs()}D OVERDUE';
      return UrgencyTokens(
        level: UrgencyLevel.critical,
        label: label,
        text: isDark ? DueColors.criticalTextDark : DueColors.criticalText,
        bg: isDark ? DueColors.criticalBgDark : DueColors.criticalBg,
      );
    } else if (daysRemaining <= 3) {
      return UrgencyTokens(
        level: UrgencyLevel.critical,
        label: '${daysRemaining}D LEFT',
        text: isDark ? DueColors.criticalTextDark : DueColors.criticalText,
        bg: isDark ? DueColors.criticalBgDark : DueColors.criticalBg,
      );
    } else if (daysRemaining <= 14) {
      return UrgencyTokens(
        level: UrgencyLevel.warning,
        label: '${daysRemaining}D LEFT',
        text: isDark ? DueColors.warningTextDark : DueColors.warningText,
        bg: isDark ? DueColors.warningBgDark : DueColors.warningBg,
      );
    } else {
      return UrgencyTokens(
        level: UrgencyLevel.subtle,
        label: '${daysRemaining}D LEFT',
        text: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
        bg: isDark ? DueColors.surfaceSubtleDark : DueColors.surfaceSubtle,
      );
    }
  }

  static String formatCurrency(num amount, {String currency = 'IDR'}) {
    final formatter = NumberFormat.decimalPattern('id_ID');
    final formattedNumber = formatter.format(amount.round());
    return 'Rp $formattedNumber';
  }

  static ThemeData get lightTheme {
    return ThemeData(
      brightness: Brightness.light,
      scaffoldBackgroundColor: DueColors.canvas,
      primaryColor: DueColors.primary,
      colorScheme: const ColorScheme.light(
        primary: DueColors.primary,
        surface: DueColors.surface,
        error: DueColors.criticalText,
      ),
      fontFamily: 'SF Pro Display',
      appBarTheme: const AppBarTheme(
        backgroundColor: DueColors.canvas,
        foregroundColor: DueColors.textPrimary,
        elevation: 0,
        centerTitle: false,
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: DueColors.canvasDark,
      primaryColor: DueColors.primaryDark,
      colorScheme: const ColorScheme.dark(
        primary: DueColors.primaryDark,
        surface: DueColors.surfaceDark,
        error: DueColors.criticalTextDark,
      ),
      fontFamily: 'SF Pro Display',
      appBarTheme: const AppBarTheme(
        backgroundColor: DueColors.canvasDark,
        foregroundColor: DueColors.textPrimaryDark,
        elevation: 0,
        centerTitle: false,
      ),
    );
  }
}
