import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Switch,
  Pressable,
  StyleSheet,
} from 'react-native';
import { theme } from '../theme/theme.js';
import { BentoCard } from '../components/BentoCard.js';
import { Button } from '../components/Button.js';

export interface SettingsScreenProps {
  user: {
    email: string;
    isPro: boolean;
  };
  settings?: {
    faceIdEnabled?: boolean;
    pushEnabled?: boolean;
    digestTime?: string;
  };
  onToggleFaceId?: (enabled: boolean) => void;
  onTogglePush?: (enabled: boolean) => void;
  onRestorePurchases?: () => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenTerms?: () => void;
  onDeleteAccountPress?: () => void;
  onOpenPaywall?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  user,
  settings = {},
  onToggleFaceId,
  onTogglePush,
  onRestorePurchases,
  onOpenPrivacyPolicy,
  onOpenTerms,
  onDeleteAccountPress,
  onOpenPaywall,
}) => {
  const [faceId, setFaceId] = useState(settings.faceIdEnabled ?? false);
  const [push, setPush] = useState(settings.pushEnabled ?? true);

  const handleFaceIdChange = (val: boolean) => {
    setFaceId(val);
    onToggleFaceId?.(val);
  };

  const handlePushChange = (val: boolean) => {
    setPush(val);
    onTogglePush?.(val);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Control Center</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile & Pro Bento */}
        <BentoCard style={styles.card}>
          <Text style={styles.sectionEyebrow}>ACCOUNT & MEMBERSHIP</Text>
          <View style={styles.profileRow}>
            <View>
              <Text testID="settings-user-email" style={styles.userEmail}>
                {user.email}
              </Text>
              <Text style={styles.tierStatus}>
                {user.isPro ? 'Pro Member' : 'Free Tier (7-item limit)'}
              </Text>
            </View>
            {!user.isPro ? (
              <Button
                testID="settings-upgrade-pro"
                title="Upgrade"
                variant="primary"
                size="md"
                onPress={onOpenPaywall}
              />
            ) : (
              <View style={styles.proActiveBadge}>
                <Text style={styles.proActiveText}>PRO ACTIVE</Text>
              </View>
            )}
          </View>
        </BentoCard>

        {/* Security Bento */}
        <Text style={styles.sectionTitle}>Security & Privacy</Text>
        <BentoCard style={styles.card}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Face ID / Biometric Lock</Text>
              <Text style={styles.toggleDesc}>
                Require biometric scan on app launch
              </Text>
            </View>
            <Switch
              testID="switch-face-id"
              value={faceId}
              onValueChange={handleFaceIdChange}
              trackColor={{ true: theme.colors.light.brand.primary }}
            />
          </View>
        </BentoCard>

        {/* Notifications Bento */}
        <Text style={styles.sectionTitle}>Notifications & Digest</Text>
        <BentoCard style={styles.card}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Push Alerts</Text>
              <Text style={styles.toggleDesc}>
                Multi-stage reminders at 30d, 7d, 3d, 1d
              </Text>
            </View>
            <Switch
              testID="switch-push-alerts"
              value={push}
              onValueChange={handlePushChange}
              trackColor={{ true: theme.colors.light.brand.primary }}
            />
          </View>
        </BentoCard>

        {/* Store Compliance & Legal */}
        <Text style={styles.sectionTitle}>Purchases & Legal</Text>
        <BentoCard style={styles.card}>
          <Pressable
            testID="restore-purchases-button"
            onPress={onRestorePurchases}
            style={styles.menuRow}
          >
            <Text style={styles.menuLabel}>Restore Purchases</Text>
            <Text style={styles.menuArrow}>›</Text>
          </Pressable>
          <View style={styles.divider} />
          <Pressable onPress={onOpenPrivacyPolicy} style={styles.menuRow}>
            <Text style={styles.menuLabel}>Privacy Policy</Text>
            <Text style={styles.menuArrow}>›</Text>
          </Pressable>
          <View style={styles.divider} />
          <Pressable onPress={onOpenTerms} style={styles.menuRow}>
            <Text style={styles.menuLabel}>Terms of Service</Text>
            <Text style={styles.menuArrow}>›</Text>
          </Pressable>
        </BentoCard>

        {/* Apple 5.1.1(v) Delete Account Compliance */}
        <Text style={styles.sectionTitle}>Danger Zone</Text>
        <BentoCard style={styles.dangerCard}>
          <Text style={styles.dangerTitle}>Erase Account & Personal Data</Text>
          <Text style={styles.dangerDesc}>
            Per Apple Guideline 5.1.1(v), this permanently deletes your account,
            commitments, and Proof Vault receipts from our database and cloud storage.
          </Text>
          <Button
            testID="delete-account-button"
            title="Delete Account & Erase All Data"
            variant="danger"
            size="md"
            onPress={onDeleteAccountPress}
            style={styles.dangerButton}
          />
        </BentoCard>
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
    paddingHorizontal: theme.space[4],
    paddingVertical: theme.space[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.light.border.subtle,
  },
  headerTitle: {
    fontSize: theme.typography.headingLg.fontSize,
    fontWeight: theme.typography.headingLg.fontWeight,
    color: theme.colors.light.text.primary,
  },
  content: {
    padding: theme.space[4],
    paddingBottom: 40,
  },
  sectionEyebrow: {
    fontSize: theme.typography.captionSm.fontSize,
    fontWeight: '700',
    color: theme.colors.light.text.secondary,
    letterSpacing: 0.5,
    marginBottom: theme.space[2],
  },
  sectionTitle: {
    fontSize: theme.typography.headingMd.fontSize,
    fontWeight: '700',
    color: theme.colors.light.text.primary,
    marginTop: theme.space[4],
    marginBottom: theme.space[2],
  },
  card: {
    marginBottom: theme.space[2],
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userEmail: {
    fontSize: theme.typography.bodyLg.fontSize,
    fontWeight: '600',
    color: theme.colors.light.text.primary,
  },
  tierStatus: {
    fontSize: theme.typography.captionMd.fontSize,
    color: theme.colors.light.text.secondary,
    marginTop: 2,
  },
  proActiveBadge: {
    backgroundColor: theme.colors.light.status.safeBg,
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[1],
    borderRadius: theme.radius.sm,
  },
  proActiveText: {
    color: theme.colors.light.status.safeText,
    fontWeight: '700',
    fontSize: 11,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleInfo: {
    flex: 1,
    paddingRight: theme.space[3],
  },
  toggleLabel: {
    fontSize: theme.typography.bodyMd.fontSize,
    fontWeight: '600',
    color: theme.colors.light.text.primary,
  },
  toggleDesc: {
    fontSize: theme.typography.captionSm.fontSize,
    color: theme.colors.light.text.secondary,
    marginTop: 2,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.space[3],
  },
  menuLabel: {
    fontSize: theme.typography.bodyMd.fontSize,
    color: theme.colors.light.text.primary,
  },
  menuArrow: {
    fontSize: 20,
    color: theme.colors.light.text.muted,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.light.border.subtle,
  },
  dangerCard: {
    borderColor: theme.colors.light.status.criticalText,
    backgroundColor: theme.colors.light.status.criticalBg,
  },
  dangerTitle: {
    fontSize: theme.typography.bodyLg.fontSize,
    fontWeight: '700',
    color: theme.colors.light.status.criticalText,
  },
  dangerDesc: {
    fontSize: theme.typography.captionMd.fontSize,
    color: theme.colors.light.status.criticalText,
    marginTop: 4,
    marginBottom: theme.space[3],
    lineHeight: 18,
  },
  dangerButton: {
    width: '100%',
  },
});
