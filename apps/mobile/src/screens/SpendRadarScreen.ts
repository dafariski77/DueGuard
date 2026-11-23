import { formatCurrency } from '../theme/theme.js';
import { AnalyticsSummaryDto } from '@dueguard/shared';

export interface SpendRadarScreenProps {
  summary: AnalyticsSummaryDto;
}

export function SpendRadarScreen({ summary }: SpendRadarScreenProps) {
  const spikes = summary.upcoming90DaysSpikes || [];

  let highestMonth = '';
  let highestAmount = 0;
  let hasSpike = false;

  for (const s of spikes) {
    if (s.amount > highestAmount) {
      highestAmount = s.amount;
      highestMonth = s.month;
    }
    if (s.diffFromAverage > 0 && s.reasons.length > 0) {
      hasSpike = true;
    }
  }

  return {
    type: 'SpendRadarScreen' as const,
    header: {
      title: 'Spend Radar & Commitments',
    },
    hero: {
      monthlyRunRate: formatCurrency(summary.estMonthlySpend),
      annualizedCommitment: formatCurrency(summary.annualizedSpend),
      dueThisMonth: formatCurrency(summary.dueThisMonth),
    },
    spikeRadar: {
      spikes: spikes.map((s) => ({
        month: s.month,
        amountFormatted: formatCurrency(s.amount),
        diffFormatted: `${s.diffFromAverage >= 0 ? '+' : ''}${formatCurrency(s.diffFromAverage)}`,
        reasons: s.reasons,
        isSpike: s.reasons.length > 0,
      })),
      hasSpike,
      highestMonth,
    },
    breakdown: summary.categoryBreakdown,
  };
}
