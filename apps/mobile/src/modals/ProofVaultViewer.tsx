import React from 'react';
import {
  Modal,
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { theme } from '../theme/theme.js';
import { Button } from '../components/Button.js';

export interface ProofVaultViewerProps {
  visible?: boolean;
  attachment?: {
    id: string;
    fileName: string;
    viewUrl: string;
    mimeType?: string;
  };
  onClose?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
}

export const ProofVaultViewer: React.FC<ProofVaultViewerProps> = ({
  visible = true,
  attachment,
  onClose,
  onShare,
  onSave,
  onDelete,
}) => {
  if (!attachment) return null;

  return (
    <Modal visible={visible} animationType="fade" presentationStyle="fullScreen">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Button
            testID="vault-close"
            title="✕ Close"
            variant="ghost"
            size="md"
            onPress={onClose}
          />
          <Text numberOfLines={1} style={styles.headerTitle}>
            {attachment.fileName}
          </Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={styles.imageContainer}>
          <Image
            testID="vault-image-preview"
            source={{ uri: attachment.viewUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.footer}>
          <View style={styles.actionRow}>
            <Button
              testID="vault-share"
              title="Share"
              variant="secondary"
              size="md"
              onPress={onShare}
              style={styles.flexBtn}
            />
            <Button
              testID="vault-save"
              title="Save to Photos"
              variant="secondary"
              size="md"
              onPress={onSave}
              style={styles.flexBtn}
            />
          </View>
          <Button
            testID="vault-delete"
            title="Delete Document"
            variant="danger"
            size="md"
            onPress={onDelete}
            style={styles.deleteBtn}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[2],
  },
  headerTitle: {
    fontSize: theme.typography.bodyLg.fontSize,
    fontWeight: '600',
    color: '#FFFFFF',
    maxWidth: 200,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  footer: {
    padding: theme.space[4],
    gap: theme.space[2],
    backgroundColor: '#000000',
  },
  actionRow: {
    flexDirection: 'row',
    gap: theme.space[2],
  },
  flexBtn: {
    flex: 1,
  },
  deleteBtn: {
    width: '100%',
  },
});
