import { formatCurrency } from '../theme/theme.js';

export interface RenewalAffirmationSheetProps {
  itemTitle: string;
  oldDueDate: Date;
  newDueDate: Date;
  amount?: number;
}

export function RenewalAffirmationSheet({
  itemTitle,
  oldDueDate,
  newDueDate,
  amount,
}: RenewalAffirmationSheetProps) {
  const rolledDateFormatted = new Date(newDueDate).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return {
    type: 'RenewalAffirmationSheet' as const,
    headline: 'Renewal Logged!',
    itemTitle,
    rolledDateFormatted,
    amountFormatted: amount ? formatCurrency(amount) : null,
    undoTimeoutSeconds: 5,
    canUndo: true,
    undoLabel: 'Undo (5s)',
    doneLabel: 'Done',
  };
}
