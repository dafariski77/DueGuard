import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { theme, formatCurrency } from '../theme/theme.js';
import { BentoCard } from '../components/BentoCard.js';
import { Button } from '../components/Button.js';

export interface RenewalAffirmationSheetProps {
  visible?: boolean;
  itemTitle: string;
  oldDueDate: Date;
  newDueDate: Date;
  amount?: number;
  onUndo?: () => void;
  onDone?: () => void;
}

export const RenewalAffirmationSheet: React.FC<RenewalAffirmationSheetProps> = ({
  visible = true,
  itemTitle,
  newDueDate,
  amount,
  onUndo,
  onDone,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [visible]);

  const rolledDateFormatted = new Date(newDueDate).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.sheetContainer}>
          <BentoCard style={styles.card}>
            <View style={styles.iconContainer}>
              <Text style={styles.checkIcon}>🎉</Text>
            </View>

            <Text testID="affirmation-headline" style={styles.headline}>
              Renewal Logged!
            </Text>
            <Text style={styles.itemTitle}>{itemTitle}</Text>

            <View style={styles.rolledBox}>
              <Text style={styles.rolledLabel}>NEXT SCHEDULED DUE DATE</Text>
              <Text testID="affirmation-new-due-date" style={styles.rolledDate}>
                {rolledDateFormatted}
              </Text>
              {amount ? (
                <Text style={styles.amount}>
                  Recorded: {formatCurrency(amount)}
                </Text>
              ) : null}
            </View>

            <View style={styles.actions}>
              {secondsLeft > 0 ? (
                <Button
                  testID="affirmation-undo"
                  title={`Undo (${secondsLeft}s)`}
                  variant="secondary"
                  size="md"
                  onPress={onUndo}
                  style={styles.undoBtn}
                />
              ) : null}
              <Button
                testID="affirmation-done"
                title="Done"
                variant="primary"
                size="md"
                onPress={onDone}
                style={styles.doneBtn}
              />
            </View>
          </BentoCard>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    padding: theme.space[4],
    paddingBottom: theme.space[6],
  },
  card: {
    alignItems: 'center',
    padding: theme.space[5],
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.light.status.safeBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.space[3],
  },
  checkIcon: {
    fontSize: 28,
  },
  headline: {
    fontSize: theme.typography.headingLg.fontSize,
    fontWeight: '700',
    color: theme.colors.light.text.primary,
  },
  itemTitle: {
    fontSize: theme.typography.bodyLg.fontSize,
    color: theme.colors.light.text.secondary,
    marginTop: 2,
  },
  rolledBox: {
    backgroundColor: theme.colors.light.bg.surfaceSubtle,
    width: '100%',
    padding: theme.space[3],
    borderRadius: theme.radius.md,
    alignItems: 'center',
    marginVertical: theme.space[4],
  },
  rolledLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.light.text.secondary,
    letterSpacing: 1,
  },
  rolledDate: {
    fontSize: theme.typography.headingMd.fontSize,
    fontWeight: '700',
    color: theme.colors.light.brand.primary,
    marginTop: 4,
  },
  amount: {
    fontSize: theme.typography.captionMd.fontSize,
    color: theme.colors.light.text.muted,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.space[2],
    width: '100%',
  },
  undoBtn: {
    flex: 1,
  },
  doneBtn: {
    flex: 1,
  },
});
