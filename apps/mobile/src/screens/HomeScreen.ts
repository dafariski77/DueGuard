import { formatCurrency, getUrgencyTokens } from '../theme/theme.js';
import { Category, BillingCycle } from '@dueguard/shared';

export interface HomeItem {
  id: string;
  title: string;
  category: Category;
  amount?: number;
  billingCycle: BillingCycle;
  nextDueDate: Date;
  daysRemaining: number;
}

export interface HomeScreenProps {
  user: {
    isPro: boolean;
    activeItemCount: number;
    maxFreeItems?: number;
  };
  items: HomeItem[];
  summary: {
    estMonthlySpend: number;
    annualizedSpend: number;
    dueThisMonth: number;
  };
  activeFilter?: string;
}

export function HomeScreen({
  user,
  items,
  summary,
  activeFilter = 'ALL',
}: HomeScreenProps) {
  // Sort items by daysRemaining asc
  const sorted = [...items].sort((a, b) => a.daysRemaining - b.daysRemaining);
  const nextItem = sorted[0] || null;

  const heroItem = nextItem
    ? {
        id: nextItem.id,
        title: nextItem.title,
        category: nextItem.category,
        amountFormatted: formatCurrency(nextItem.amount || 0),
        daysRemaining: nextItem.daysRemaining,
        urgencyTokens: getUrgencyTokens(nextItem.daysRemaining),
        urgencyLevel: getUrgencyTokens(nextItem.daysRemaining).level,
      }
    : null;

  const maxFree = user.maxFreeItems ?? 7;
  const tierStatus = {
    isPro: user.isPro,
    label: user.isPro
      ? 'Pro Unlimited'
      : `${user.activeItemCount} / ${maxFree} Free Items`,
    canAddMore: user.isPro || user.activeItemCount < maxFree,
  };

  const filterTabs = [
    { id: 'ALL', label: 'All' },
    { id: 'SUBSCRIPTION', label: 'Subscriptions' },
    { id: 'WARRANTY', label: 'Warranties' },
    { id: 'BILL_ID', label: 'Bills & IDs' },
  ];

  const filteredItems = sorted.filter((item) => {
    if (activeFilter === 'ALL') return true;
    return item.category === activeFilter;
  });

  const timeline = filteredItems.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    amountFormatted: formatCurrency(item.amount || 0),
    dueDateFormatted: new Date(item.nextDueDate).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    urgencyBadge: getUrgencyTokens(item.daysRemaining),
    daysRemaining: item.daysRemaining,
  }));

  return {
    type: 'HomeScreen' as const,
    header: {
      title: 'DueGuard',
      isPro: user.isPro,
    },
    heroItem,
    burnMetric: {
      monthlyRunRateFormatted: `${formatCurrency(summary.estMonthlySpend)} / bln`,
      annualizedFormatted: formatCurrency(summary.annualizedSpend),
    },
    tierStatus,
    filterTabs,
    timeline,
    fab: {
      title: '+ Add Due Item',
      enabled: tierStatus.canAddMore,
    },
  };
}
