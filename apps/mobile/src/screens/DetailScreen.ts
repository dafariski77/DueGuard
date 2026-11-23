import { formatCurrency, getUrgencyTokens } from '../theme/theme.js';
import { Category, BillingCycle } from '@dueguard/shared';

export interface DetailItem {
  id: string;
  title: string;
  category: Category;
  amount?: number;
  billingCycle: BillingCycle;
  nextDueDate: Date;
  daysRemaining: number;
  notes?: string;
  cancelUrl?: string;
  attachments?: Array<{ id: string; fileName: string }>;
}

export interface DetailScreenProps {
  item: DetailItem;
  isPro?: boolean;
}

export function DetailScreen({ item, isPro = false }: DetailScreenProps) {
  const urgency = getUrgencyTokens(item.daysRemaining);
  const attachments = item.attachments || [];
  const maxFreeAttachments = 2;

  const canAddMore = isPro || attachments.length < maxFreeAttachments;

  return {
    type: 'DetailScreen' as const,
    pass: {
      id: item.id,
      title: item.title,
      category: item.category,
      urgency,
      amountFormatted: formatCurrency(item.amount || 0),
    },
    specs: {
      billingCycle: item.billingCycle,
      dueDateFormatted: new Date(item.nextDueDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      cancelUrl: item.cancelUrl || null,
      notes: item.notes || null,
    },
    proofVault: {
      attachments,
      count: attachments.length,
      limitLabel: isPro ? 'Unlimited (Pro)' : `${attachments.length} / ${maxFreeAttachments} Free`,
      canAddMore,
    },
    actions: [
      { id: 'mark_renewed', label: 'Mark Renewed / Paid', variant: 'primary' },
      { id: 'edit_item', label: 'Edit Details', variant: 'secondary' },
      { id: 'delete_item', label: 'Delete Item', variant: 'danger' },
    ],
  };
}
