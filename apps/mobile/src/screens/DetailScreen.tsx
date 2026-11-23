import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { theme, formatCurrency } from '../theme/theme.js';
import { BentoCard } from '../components/BentoCard.js';
import { CountdownBadge } from '../components/CountdownBadge.js';
import { Button } from '../components/Button.js';
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
  attachments?: Array<{ id: string; fileName: string; viewUrl?: string }>;
}

export interface DetailScreenProps {
  item: DetailItem;
  isPro?: boolean;
  onBack?: () => void;
  onMarkRenewed?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddAttachment?: () => void;
  onViewAttachment?: (attachment: { id: string; fileName: string; viewUrl?: string }) => void;
}

export const DetailScreen: React.FC<DetailScreenProps> = ({
  item,
  isPro = false,
  onBack,
  onMarkRenewed,
  onEdit,
  onDelete,
  onAddAttachment,
  onViewAttachment,
}) => {
  const attachments = item.attachments || [];
  const maxFree = 2;
  const canAddAttachment = isPro || attachments.length < maxFree;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Button
          testID="detail-back-button"
          title="← Back"
          variant="ghost"
          size="md"
          onPress={onBack}
        />
        <Text style={styles.headerTitle}>Digital Pass</Text>
        <Button
          testID="detail-edit-button"
          title="Edit"
          variant="ghost"
          size="md"
          onPress={onEdit}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Digital Pass Hero */}
        <BentoCard variant="hero" style={styles.passCard}>
          <View style={styles.passTop}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{item.category}</Text>
            </View>
            <CountdownBadge daysRemaining={item.daysRemaining} />
          </View>
          <Text style={styles.passTitle}>{item.title}</Text>
          <Text style={styles.passAmount}>
            {formatCurrency(item.amount || 0)}
          </Text>
          <Text style={styles.passCycle}>Billed {item.billingCycle}</Text>
        </BentoCard>

        {/* Specifications Bento */}
        <Text style={styles.sectionTitle}>Specifications</Text>
        <BentoCard style={styles.specsCard}>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Due Date</Text>
            <Text style={styles.specValue}>
              {new Date(item.nextDueDate).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Billing Frequency</Text>
            <Text style={styles.specValue}>{item.billingCycle}</Text>
          </View>
          {item.notes ? (
            <>
              <View style={styles.divider} />
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Notes / Account</Text>
                <Text style={styles.specValue}>{item.notes}</Text>
              </View>
            </>
          ) : null}
          {item.cancelUrl ? (
            <>
              <View style={styles.divider} />
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Direct Portal</Text>
                <Text style={[styles.specValue, styles.linkText]}>
                  Open Provider Site ↗
                </Text>
              </View>
            </>
          ) : null}
        </BentoCard>

        {/* Proof Vault Section */}
        <View style={styles.vaultHeader}>
          <Text style={styles.sectionTitle}>Proof Vault & Receipts</Text>
          <Text style={styles.vaultLimit}>
            {isPro ? 'Unlimited (Pro)' : `${attachments.length} / ${maxFree} Free`}
          </Text>
        </View>

        <BentoCard style={styles.vaultCard}>
          {attachments.length > 0 ? (
            <View style={styles.attachmentGrid}>
              {attachments.map((att) => (
                <Pressable
                  key={att.id}
                  testID={`attachment-item-${att.id}`}
                  onPress={() => onViewAttachment?.(att)}
                  style={styles.attachmentThumb}
                >
                  <Text style={styles.attachmentIcon}>📄</Text>
                  <Text numberOfLines={1} style={styles.attachmentName}>
                    {att.fileName}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <Text style={styles.noAttachmentsText}>
              No receipts or warranty cards uploaded yet.
            </Text>
          )}

          <Button
            testID="add-attachment-button"
            title={canAddAttachment ? '+ Upload Document' : 'Pro Required for More'}
            variant="secondary"
            size="md"
            disabled={!canAddAttachment}
            onPress={onAddAttachment}
            style={styles.uploadButton}
          />
        </BentoCard>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button
            testID="mark-renewed-button"
            title="Mark Renewed / Paid"
            variant="primary"
            size="lg"
            onPress={onMarkRenewed}
            style={styles.actionButton}
          />
          <Button
            testID="delete-item-button"
            title="Delete Commitment"
            variant="danger"
            size="md"
            onPress={onDelete}
            style={styles.actionButton}
          />
        </View>
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
    paddingBottom: 40,
  },
  passCard: {
    marginBottom: theme.space[4],
    padding: theme.space[5],
  },
  passTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.space[3],
  },
  categoryBadge: {
    backgroundColor: theme.colors.light.brand.primary,
    paddingHorizontal: theme.space[2],
    paddingVertical: theme.space[1],
    borderRadius: theme.radius.sm,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  passTitle: {
    fontSize: theme.typography.headingLg.fontSize,
    fontWeight: '700',
    color: theme.colors.light.text.primary,
  },
  passAmount: {
    fontSize: theme.typography.displayLg.fontSize,
    fontWeight: '700',
    color: theme.colors.light.text.primary,
    fontVariant: ['tabular-nums'],
    marginVertical: theme.space[1],
  },
  passCycle: {
    fontSize: theme.typography.captionMd.fontSize,
    color: theme.colors.light.text.secondary,
  },
  sectionTitle: {
    fontSize: theme.typography.captionSm.fontSize,
    fontWeight: '700',
    color: theme.colors.light.text.secondary,
    letterSpacing: 0.5,
    marginBottom: theme.space[2],
  },
  specsCard: {
    marginBottom: theme.space[4],
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.space[2],
  },
  specLabel: {
    fontSize: theme.typography.bodyMd.fontSize,
    color: theme.colors.light.text.secondary,
  },
  specValue: {
    fontSize: theme.typography.bodyMd.fontSize,
    fontWeight: '600',
    color: theme.colors.light.text.primary,
  },
  linkText: {
    color: theme.colors.light.brand.primary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.light.border.subtle,
  },
  vaultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vaultLimit: {
    fontSize: theme.typography.captionSm.fontSize,
    color: theme.colors.light.text.muted,
  },
  vaultCard: {
    marginBottom: theme.space[4],
  },
  attachmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space[2],
    marginBottom: theme.space[3],
  },
  attachmentThumb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space[1],
    backgroundColor: theme.colors.light.bg.surfaceSubtle,
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[2],
    borderRadius: theme.radius.sm,
    maxWidth: 160,
  },
  attachmentIcon: {
    fontSize: 16,
  },
  attachmentName: {
    fontSize: theme.typography.captionMd.fontSize,
    color: theme.colors.light.text.primary,
  },
  noAttachmentsText: {
    fontSize: theme.typography.captionMd.fontSize,
    color: theme.colors.light.text.muted,
    marginBottom: theme.space[3],
  },
  uploadButton: {
    marginTop: theme.space[2],
  },
  actionsContainer: {
    gap: theme.space[2],
    marginTop: theme.space[2],
  },
  actionButton: {
    width: '100%',
  },
});
