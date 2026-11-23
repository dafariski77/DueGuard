import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { theme } from '../theme/theme.js';
import { BentoCard } from '../components/BentoCard.js';
import { Button } from '../components/Button.js';
import { Input } from '../components/Input.js';

export interface DeleteConsentDialogProps {
  visible?: boolean;
  userEmail: string;
  itemCount: number;
  attachmentCount: number;
  onCancel?: () => void;
  onConfirmDelete?: () => void;
}

export const DeleteConsentDialog: React.FC<DeleteConsentDialogProps> = ({
  visible = true,
  userEmail,
  itemCount,
  attachmentCount,
  onCancel,
  onConfirmDelete,
}) => {
  const [confirmationInput, setConfirmationInput] = useState('');
  const isConfirmed = confirmationInput.trim().toUpperCase() === 'DELETE';

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <BentoCard style={styles.card}>
            <View style={styles.warningCircle}>
              <Text style={styles.warningIcon}>⚠️</Text>
            </View>

            <Text testID="delete-headline" style={styles.headline}>
              Permanently Erase Account?
            </Text>
            <Text style={styles.warningText}>
              This action is permanent and cannot be undone. All your tracked subscriptions,
              bills, and Proof Vault receipts will be immediately erased.
            </Text>

            <View style={styles.consequences}>
              <Text style={styles.consequenceItem}>
                • Delete {itemCount} active commitments and historical logs.
              </Text>
              <Text style={styles.consequenceItem}>
                • Purge {attachmentCount} uploaded receipts from Cloudflare R2 / S3.
              </Text>
              <Text style={styles.consequenceItem}>
                • Terminate all active push notifications for {userEmail}.
              </Text>
            </View>

            <Text style={styles.prompt}>
              Type <Text style={styles.boldPrompt}>DELETE</Text> to confirm:
            </Text>
            <Input
              testID="delete-confirm-input"
              value={confirmationInput}
              placeholder="DELETE"
              onChangeText={setConfirmationInput}
              style={styles.input}
            />

            <Button
              testID="confirm-delete-button"
              title="Permanently Delete My Data"
              variant="danger"
              size="lg"
              disabled={!isConfirmed}
              onPress={onConfirmDelete}
              style={styles.deleteBtn}
            />
            <Button
              testID="cancel-delete-button"
              title="Cancel / Keep Account"
              variant="ghost"
              size="md"
              onPress={onCancel}
              style={styles.cancelBtn}
            />
          </BentoCard>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.space[4],
  },
  container: {
    width: '100%',
    maxWidth: 380,
  },
  card: {
    padding: theme.space[5],
    alignItems: 'center',
    borderColor: theme.colors.light.status.criticalText,
  },
  warningCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.light.status.criticalBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.space[3],
  },
  warningIcon: {
    fontSize: 26,
  },
  headline: {
    fontSize: theme.typography.headingMd.fontSize,
    fontWeight: '700',
    color: theme.colors.light.status.criticalText,
    textAlign: 'center',
  },
  warningText: {
    fontSize: theme.typography.bodyMd.fontSize,
    color: theme.colors.light.text.secondary,
    textAlign: 'center',
    marginTop: theme.space[2],
    lineHeight: 20,
  },
  consequences: {
    width: '100%',
    backgroundColor: theme.colors.light.status.criticalBg,
    borderRadius: theme.radius.md,
    padding: theme.space[3],
    marginVertical: theme.space[3],
    gap: 4,
  },
  consequenceItem: {
    fontSize: theme.typography.captionSm.fontSize,
    color: theme.colors.light.status.criticalText,
    lineHeight: 16,
  },
  prompt: {
    fontSize: theme.typography.captionMd.fontSize,
    color: theme.colors.light.text.secondary,
    alignSelf: 'flex-start',
    marginBottom: theme.space[1],
  },
  boldPrompt: {
    fontWeight: '700',
    color: theme.colors.light.status.criticalText,
  },
  input: {
    width: '100%',
  },
  deleteBtn: {
    width: '100%',
    marginBottom: theme.space[2],
  },
  cancelBtn: {
    width: '100%',
  },
});
