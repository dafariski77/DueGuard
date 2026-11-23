import { PREBUILT_TEMPLATES, Category, BillingCycle } from '@dueguard/shared';

export interface QuickAddScreenProps {
  selectedTemplateId?: string;
  initialValues?: {
    title?: string;
    category?: Category;
    billingCycle?: BillingCycle;
    amount?: number;
    nextDueDate?: Date;
    reminderDaysBefore?: number[];
    notes?: string;
  };
}

export function QuickAddScreen({
  selectedTemplateId,
  initialValues = {},
}: QuickAddScreenProps = {}) {
  const template = selectedTemplateId
    ? PREBUILT_TEMPLATES.find((t) => t.id === selectedTemplateId)
    : null;

  const form = {
    title: initialValues.title ?? template?.name ?? '',
    category:
      initialValues.category ?? template?.category ?? Category.SUBSCRIPTION,
    billingCycle:
      initialValues.billingCycle ??
      template?.defaultBillingCycle ??
      BillingCycle.MONTHLY,
    amount: initialValues.amount ?? template?.defaultCost ?? 0,
    nextDueDate: initialValues.nextDueDate ?? new Date(),
    reminderDaysBefore:
      initialValues.reminderDaysBefore ??
      template?.defaultRemindDaysBefore ??
      [7, 1],
    notes: initialValues.notes ?? '',
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.title.trim()) {
      errors.title = 'Title is required';
    }
    if (form.amount < 0) {
      errors.amount = 'Amount cannot be negative';
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  return {
    type: 'QuickAddScreen' as const,
    header: {
      title: 'New Due Item',
      cancelLabel: 'Cancel',
      saveLabel: 'Save',
    },
    templateChips: PREBUILT_TEMPLATES.slice(0, 10).map((t) => ({
      id: t.id,
      name: t.name,
      category: t.category,
      icon: t.icon,
      isSelected: t.id === selectedTemplateId,
    })),
    form,
    validate,
  };
}
