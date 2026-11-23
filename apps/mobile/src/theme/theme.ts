export const theme = {
  colors: {
    light: {
      bg: {
        canvas: '#F8FAFC',
        surface: '#FFFFFF',
        surfaceSubtle: '#F1F5F9',
      },
      border: {
        subtle: '#E2E8F0',
      },
      text: {
        primary: '#0F172A',
        secondary: '#475569',
        muted: '#94A3B8',
      },
      brand: {
        primary: '#4F46E5',
        primarySoft: '#EEF2FF',
      },
      status: {
        criticalText: '#DC2626',
        criticalBg: '#FEF2F2',
        warningText: '#D97706',
        warningBg: '#FFFBEB',
        safeText: '#059669',
        safeBg: '#ECFDF5',
      },
      category: {
        subscriptionText: '#4F46E5',
        subscriptionBg: '#EEF2FF',
        warrantyText: '#0284C7',
        warrantyBg: '#F0F9FF',
        billIdText: '#7C3AED',
        billIdBg: '#F5F3FF',
      },
    },
    dark: {
      bg: {
        canvas: '#0B0F19',
        surface: '#151B2B',
        surfaceSubtle: '#1E2638',
      },
      border: {
        subtle: '#263046',
      },
      text: {
        primary: '#F8FAFC',
        secondary: '#94A3B8',
        muted: '#64748B',
      },
      brand: {
        primary: '#6366F1',
        primarySoft: '#1E1B4B',
      },
      status: {
        criticalText: '#F87171',
        criticalBg: '#450A0A',
        warningText: '#FBBF24',
        warningBg: '#451A03',
        safeText: '#34D399',
        safeBg: '#064E3B',
      },
      category: {
        subscriptionText: '#818CF8',
        subscriptionBg: '#1E1B4B',
        warrantyText: '#38BDF8',
        warrantyBg: '#0C4A6E',
        billIdText: '#A78BFA',
        billIdBg: '#2E1065',
      },
    },
  },
  typography: {
    displayLg: { fontSize: 32, lineHeight: 38, fontWeight: '700' as const },
    headingLg: { fontSize: 24, lineHeight: 30, fontWeight: '700' as const },
    headingMd: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const },
    bodyLg: { fontSize: 16, lineHeight: 22, fontWeight: '500' as const },
    bodyMd: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
    captionMd: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const },
    captionSm: { fontSize: 11, lineHeight: 14, fontWeight: '600' as const },
  },
  space: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999,
  },
};

export function getUrgencyTokens(daysRemaining: number, isDark = false) {
  const mode = isDark ? theme.colors.dark : theme.colors.light;

  if (daysRemaining <= 3) {
    return {
      level: 'critical' as const,
      text: mode.status.criticalText,
      bg: mode.status.criticalBg,
      label: daysRemaining <= 0 ? 'DUE TODAY' : `${daysRemaining}D LEFT`,
    };
  }

  if (daysRemaining <= 14) {
    return {
      level: 'warning' as const,
      text: mode.status.warningText,
      bg: mode.status.warningBg,
      label: `${daysRemaining}D LEFT`,
    };
  }

  return {
    level: 'subtle' as const,
    text: mode.text.secondary,
    bg: mode.bg.surfaceSubtle,
    label: `${daysRemaining}D LEFT`,
  };
}

export function formatCurrency(amount: number, currency = 'IDR'): string {
  if (currency === 'IDR') {
    return `Rp ${Math.round(amount).toLocaleString('id-ID')}`;
  }
  return `${currency} ${amount.toLocaleString()}`;
}
