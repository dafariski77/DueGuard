import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { theme } from '../theme/theme.js';
import { Input } from '../components/Input.js';
import { Button } from '../components/Button.js';
import { BentoCard } from '../components/BentoCard.js';
import { PREBUILT_TEMPLATES, Category, BillingCycle, ItemTemplate } from '@dueguard/shared';

export interface QuickAddScreenProps {
  initialTemplateId?: string;
  onCancel?: () => void;
  onSave?: (data: {
    title: string;
    category: Category;
    billingCycle: BillingCycle;
    amount: number;
    nextDueDate: Date;
    reminderDaysBefore: number[];
    notes?: string;
  }) => void;
}

export const QuickAddScreen: React.FC<QuickAddScreenProps> = ({
  initialTemplateId,
  onCancel,
  onSave,
}) => {
  const initialTemplate = initialTemplateId
    ? PREBUILT_TEMPLATES.find((t) => t.id === initialTemplateId)
    : null;

  const [title, setTitle] = useState(initialTemplate?.name || '');
  const [category, setCategory] = useState<Category>(
    initialTemplate?.category || Category.SUBSCRIPTION
  );
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(
    initialTemplate?.defaultBillingCycle || BillingCycle.MONTHLY
  );
  const [amountStr, setAmountStr] = useState(
    initialTemplate?.defaultCost ? String(initialTemplate.defaultCost) : ''
  );
  const [dueDateStr, setDueDateStr] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [reminders, setReminders] = useState<number[]>(
    initialTemplate?.defaultRemindDaysBefore || [7, 1]
  );
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSelectTemplate = (template: ItemTemplate) => {
    setTitle(template.name);
    setCategory(template.category);
    setBillingCycle(template.defaultBillingCycle);
    setAmountStr(String(template.defaultCost));
    setReminders(template.defaultRemindDaysBefore);
  };

  const toggleReminder = (days: number) => {
    if (reminders.includes(days)) {
      setReminders(reminders.filter((d) => d !== days));
    } else {
      setReminders([...reminders, days].sort((a, b) => b - a));
    }
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    const amount = Number(amountStr) || 0;
    if (amount < 0) newErrors.amount = 'Amount cannot be negative';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave?.({
      title,
      category,
      billingCycle,
      amount,
      nextDueDate: new Date(dueDateStr),
      reminderDaysBefore: reminders,
      notes,
    });
  };

  const categories = [
    { id: Category.SUBSCRIPTION, label: 'Subscription' },
    { id: Category.WARRANTY, label: 'Warranty' },
    { id: Category.BILL_ID, label: 'Bill & ID' },
  ];

  const cycles = [
    { id: BillingCycle.MONTHLY, label: 'Monthly' },
    { id: BillingCycle.QUARTERLY, label: 'Quarterly' },
    { id: BillingCycle.YEARLY, label: 'Yearly' },
    { id: BillingCycle.ONE_TIME, label: 'One-Time' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Button
          testID="quick-add-cancel"
          title="Cancel"
          variant="ghost"
          size="md"
          onPress={onCancel}
        />
        <Text style={styles.headerTitle}>New Due Item</Text>
        <Button
          testID="quick-add-save"
          title="Save"
          variant="primary"
          size="md"
          onPress={handleSave}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Templates Carousel */}
        <Text style={styles.sectionTitle}>Popular Templates</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.templateScroll}
        >
          {PREBUILT_TEMPLATES.slice(0, 10).map((t) => (
            <Pressable
              key={t.id}
              testID={`template-chip-${t.id}`}
              onPress={() => handleSelectTemplate(t)}
              style={[
                styles.templateChip,
                title === t.name && styles.templateChipSelected,
              ]}
            >
              <Text style={styles.templateChipText}>{t.name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Inputs */}
        <Input
          testID="input-title"
          label="Item Title"
          placeholder="e.g. Netflix, STNK Mobil, AppleCare"
          value={title}
          error={errors.title}
          onChangeText={setTitle}
        />

        {/* Category Selector */}
        <Text style={styles.fieldLabel}>Category</Text>
        <View style={styles.pillRow}>
          {categories.map((c) => (
            <Pressable
              key={c.id}
              testID={`category-pill-${c.id}`}
              onPress={() => setCategory(c.id)}
              style={[
                styles.categoryPill,
                category === c.id && styles.categoryPillActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryPillText,
                  category === c.id && styles.categoryPillTextActive,
                ]}
              >
                {c.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Amount Input */}
        <Input
          testID="input-amount"
          label="Amount (IDR)"
          placeholder="0"
          value={amountStr}
          keyboardType="numeric"
          error={errors.amount}
          onChangeText={setAmountStr}
        />

        {/* Billing Cycle */}
        <Text style={styles.fieldLabel}>Billing Cycle</Text>
        <View style={styles.pillRow}>
          {cycles.map((cy) => (
            <Pressable
              key={cy.id}
              testID={`cycle-pill-${cy.id}`}
              onPress={() => setBillingCycle(cy.id)}
              style={[
                styles.cyclePill,
                billingCycle === cy.id && styles.cyclePillActive,
              ]}
            >
              <Text
                style={[
                  styles.cyclePillText,
                  billingCycle === cy.id && styles.cyclePillTextActive,
                ]}
              >
                {cy.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Due Date String */}
        <Input
          testID="input-due-date"
          label="Next Due Date (YYYY-MM-DD)"
          placeholder="2026-05-15"
          value={dueDateStr}
          onChangeText={setDueDateStr}
        />

        {/* Multi-Stage Reminders */}
        <Text style={styles.fieldLabel}>Smart Reminder Alerts</Text>
        <View style={styles.pillRow}>
          {[30, 14, 7, 3, 1].map((days) => {
            const isSelected = reminders.includes(days);
            return (
              <Pressable
                key={days}
                testID={`reminder-toggle-${days}`}
                onPress={() => toggleReminder(days)}
                style={[
                  styles.reminderTag,
                  isSelected && styles.reminderTagActive,
                ]}
              >
                <Text
                  style={[
                    styles.reminderTagText,
                    isSelected && styles.reminderTagTextActive,
                  ]}
                >
                  {days}d before
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Notes */}
        <Input
          testID="input-notes"
          label="Notes / Policy / Account No"
          placeholder="e.g. Account tied to work email"
          value={notes}
          onChangeText={setNotes}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.light.bg.canvas,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.space[4],
    paddingVertical: theme.space[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.light.border.subtle,
  },
  headerTitle: {
    fontSize: theme.typography.headingMd.fontSize,
    fontWeight: theme.typography.headingMd.fontWeight,
    color: theme.colors.light.text.primary,
  },
  content: {
    padding: theme.space[4],
  },
  sectionTitle: {
    fontSize: theme.typography.captionSm.fontSize,
    fontWeight: '700',
    color: theme.colors.light.text.secondary,
    letterSpacing: 0.5,
    marginBottom: theme.space[2],
  },
  templateScroll: {
    flexDirection: 'row',
    gap: theme.space[2],
    marginBottom: theme.space[4],
  },
  templateChip: {
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[2],
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.light.bg.surface,
    borderWidth: 1,
    borderColor: theme.colors.light.border.subtle,
  },
  templateChipSelected: {
    borderColor: theme.colors.light.brand.primary,
    backgroundColor: theme.colors.light.brand.primarySoft,
  },
  templateChipText: {
    fontSize: theme.typography.captionMd.fontSize,
    color: theme.colors.light.text.primary,
    fontWeight: '500',
  },
  fieldLabel: {
    fontSize: theme.typography.captionMd.fontSize,
    fontWeight: theme.typography.captionMd.fontWeight,
    color: theme.colors.light.text.secondary,
    marginBottom: theme.space[1],
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space[2],
    marginBottom: theme.space[3],
  },
  categoryPill: {
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[2],
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.light.bg.surfaceSubtle,
  },
  categoryPillActive: {
    backgroundColor: theme.colors.light.brand.primary,
  },
  categoryPillText: {
    fontSize: theme.typography.captionMd.fontSize,
    color: theme.colors.light.text.secondary,
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  cyclePill: {
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[2],
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.light.bg.surfaceSubtle,
  },
  cyclePillActive: {
    backgroundColor: theme.colors.light.text.primary,
  },
  cyclePillText: {
    fontSize: theme.typography.captionMd.fontSize,
    color: theme.colors.light.text.secondary,
  },
  cyclePillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  reminderTag: {
    paddingHorizontal: theme.space[2],
    paddingVertical: theme.space[1],
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.light.bg.surfaceSubtle,
    borderWidth: 1,
    borderColor: theme.colors.light.border.subtle,
  },
  reminderTagActive: {
    backgroundColor: theme.colors.light.brand.primarySoft,
    borderColor: theme.colors.light.brand.primary,
  },
  reminderTagText: {
    fontSize: theme.typography.captionSm.fontSize,
    color: theme.colors.light.text.secondary,
  },
  reminderTagTextActive: {
    color: theme.colors.light.brand.primary,
    fontWeight: '600',
  },
});
