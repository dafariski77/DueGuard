import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { theme } from '../theme/theme.js';
import { BentoCard } from '../components/BentoCard.js';
import { Button } from '../components/Button.js';

export interface NotificationConsentModalProps {
  visible?: boolean;
  onEnable?: () => void;
  onDismiss?: () => void;
}

export const NotificationConsentModal: React.FC<NotificationConsentModalProps> = ({
  visible = true,
  onEnable,
  onDismiss,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <BentoCard style={styles.card}>
            <View style={styles.iconCircle}>
              <Text style={styles.bellIcon}>🔔</Text>
            </View>

            <Text testID="consent-headline" style={styles.headline}>
              Timely Alerts Before You Incur Late Fees
            </Text>
            <Text style={styles.body}>
              DueGuard sends actionable notifications only when an upcoming subscription or bill requires attention.
            </Text>

            <View style={styles.benefitsList}>
              <Text style={styles.benefitItem}>
                • 30-day heads-up for annual bills like STNK and insurance
              </Text>
              <Text style={styles.benefitItem}>
                • 7-day and 3-day reminder to review payment or cancel
              </Text>
              <Text style={styles.benefitItem}>
                • 1-day final alert on the day of renewal
              </Text>
            </View>

            <Button
              testID="enable-notifications-button"
              title="Enable Notifications"
              variant="primary"
              size="lg"
              onPress={onEnable}
              style={styles.enableBtn}
            />
            <Button
              testID="dismiss-notifications-button"
              title="Maybe Later"
              variant="ghost"
              size="md"
              onPress={onDismiss}
              style={styles.dismissBtn}
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
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.space[4],
  },
  container: {
    width: '100%',
    maxWidth: 380,
  },
  card: {
    alignItems: 'center',
    padding: theme.space[5],
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.light.brand.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.space[3],
  },
  bellIcon: {
    fontSize: 28,
  },
  headline: {
    fontSize: theme.typography.headingMd.fontSize,
    fontWeight: '700',
    color: theme.colors.light.text.primary,
    textAlign: 'center',
  },
  body: {
    fontSize: theme.typography.bodyMd.fontSize,
    color: theme.colors.light.text.secondary,
    textAlign: 'center',
    marginTop: theme.space[2],
    lineHeight: 20,
  },
  benefitsList: {
    width: '100%',
    backgroundColor: theme.colors.light.bg.surfaceSubtle,
    borderRadius: theme.radius.md,
    padding: theme.space[3],
    marginVertical: theme.space[4],
    gap: 6,
  },
  benefitItem: {
    fontSize: theme.typography.captionMd.fontSize,
    color: theme.colors.light.text.secondary,
    lineHeight: 18,
  },
  enableBtn: {
    width: '100%',
    marginBottom: theme.space[2],
  },
  dismissBtn: {
    width: '100%',
  },
});
