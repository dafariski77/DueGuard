import React, { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { theme } from '../theme/theme.js';
import { BentoCard } from '../components/BentoCard.js';
import { Button } from '../components/Button.js';

export interface PaywallModalProps {
  visible?: boolean;
  onClose?: () => void;
  onSubscribe?: (plan: 'annual' | 'monthly') => void;
  onRestorePurchases?: () => void;
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  visible = true,
  onClose,
  onSubscribe,
  onRestorePurchases,
  onOpenTerms,
  onOpenPrivacy,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');

  const features = [
    { title: 'Unlimited Due Items', desc: 'Bypass the 7-item Free tier ceiling' },
    { title: 'Multi-Stage Smart Alerts', desc: 'Advance warnings at 30d, 7d, 3d, and 1d' },
    { title: 'Unlimited Proof Vault', desc: 'Encrypted document storage for receipts & IDs' },
    { title: '90-Day Cash Spike Radar', desc: 'Anticipate annual tax and vehicle spikes' },
    { title: 'Face ID & Biometrics', desc: 'Hardware-enclave protection on app launch' },
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={{ width: 44 }} />
          <Text style={styles.headerTitle}>DueGuard Pro</Text>
          <Button
            testID="paywall-close"
            title="✕"
            variant="ghost"
            size="md"
            onPress={onClose}
          />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.hero}>
            <Text style={styles.heroEyebrow}>UPGRADE</Text>
            <Text style={styles.heroTitle}>Total Financial Peace of Mind</Text>
            <Text style={styles.heroSub}>
              Never miss a renewal, warranty expiration, or civic deadline again.
            </Text>
          </View>

          {/* Features Bento */}
          <BentoCard style={styles.featuresCard}>
            {features.map((f, idx) => (
              <View key={idx} style={styles.featureRow}>
                <Text style={styles.checkIcon}>✓</Text>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureDesc}>{f.desc}</Text>
                </View>
              </View>
            ))}
          </BentoCard>

          {/* Pricing Options */}
          <View style={styles.plansContainer}>
            {/* Annual Plan */}
            <Pressable
              testID="plan-annual"
              onPress={() => setSelectedPlan('annual')}
            >
              <BentoCard
                variant={selectedPlan === 'annual' ? 'highlight' : 'standard'}
                style={styles.planCard}
              >
                <View style={styles.planBadge}>
                  <Text style={styles.planBadgeText}>BEST VALUE • 7-DAY FREE TRIAL</Text>
                </View>
                <View style={styles.planRow}>
                  <View>
                    <Text style={styles.planTitle}>Annual Membership</Text>
                    <Text style={styles.planSub}>Rp 16.583 / month (Save 42%)</Text>
                  </View>
                  <Text style={styles.planPrice}>Rp 199.000 / yr</Text>
                </View>
              </BentoCard>
            </Pressable>

            {/* Monthly Plan */}
            <Pressable
              testID="plan-monthly"
              onPress={() => setSelectedPlan('monthly')}
            >
              <BentoCard
                variant={selectedPlan === 'monthly' ? 'highlight' : 'standard'}
                style={styles.planCard}
              >
                <View style={styles.planRow}>
                  <View>
                    <Text style={styles.planTitle}>Monthly Membership</Text>
                    <Text style={styles.planSub}>Billed monthly, cancel anytime</Text>
                  </View>
                  <Text style={styles.planPrice}>Rp 29.000 / mo</Text>
                </View>
              </BentoCard>
            </Pressable>
          </View>

          <Button
            testID="paywall-cta-button"
            title={selectedPlan === 'annual' ? 'Start 7-Day Free Trial' : 'Subscribe Now'}
            size="lg"
            variant="primary"
            onPress={() => onSubscribe?.(selectedPlan)}
            style={styles.ctaButton}
          />

          <Text style={styles.trialNotice}>
            Cancel anytime in App Store Subscriptions. You will not be charged before the trial ends.
          </Text>

          <View style={styles.legalRow}>
            <Pressable testID="paywall-restore" onPress={onRestorePurchases}>
              <Text style={styles.legalLink}>Restore Purchases</Text>
            </Pressable>
            <Text style={styles.legalDot}>•</Text>
            <Pressable onPress={onOpenTerms}>
              <Text style={styles.legalLink}>Terms of Service</Text>
            </Pressable>
            <Text style={styles.legalDot}>•</Text>
            <Pressable onPress={onOpenPrivacy}>
              <Text style={styles.legalLink}>Privacy Policy</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
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
    paddingVertical: theme.space[2],
  },
  headerTitle: {
    fontSize: theme.typography.headingMd.fontSize,
    fontWeight: '700',
    color: theme.colors.light.text.primary,
  },
  content: {
    padding: theme.space[4],
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    marginBottom: theme.space[4],
  },
  heroEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.light.brand.primary,
    letterSpacing: 2,
  },
  heroTitle: {
    fontSize: theme.typography.displayLg.fontSize,
    fontWeight: '700',
    color: theme.colors.light.text.primary,
    textAlign: 'center',
    marginTop: 4,
  },
  heroSub: {
    fontSize: theme.typography.bodyMd.fontSize,
    color: theme.colors.light.text.secondary,
    textAlign: 'center',
    marginTop: theme.space[2],
  },
  featuresCard: {
    marginBottom: theme.space[4],
  },
  featureRow: {
    flexDirection: 'row',
    gap: theme.space[3],
    marginBottom: theme.space[3],
  },
  checkIcon: {
    fontSize: 16,
    color: theme.colors.light.brand.primary,
    fontWeight: '700',
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: theme.typography.bodyMd.fontSize,
    fontWeight: '600',
    color: theme.colors.light.text.primary,
  },
  featureDesc: {
    fontSize: theme.typography.captionMd.fontSize,
    color: theme.colors.light.text.secondary,
    marginTop: 2,
  },
  plansContainer: {
    gap: theme.space[3],
    marginBottom: theme.space[4],
  },
  planCard: {
    padding: theme.space[4],
  },
  planBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.light.brand.primarySoft,
    paddingHorizontal: theme.space[2],
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
    marginBottom: theme.space[2],
  },
  planBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.light.brand.primary,
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planTitle: {
    fontSize: theme.typography.bodyLg.fontSize,
    fontWeight: '700',
    color: theme.colors.light.text.primary,
  },
  planSub: {
    fontSize: theme.typography.captionMd.fontSize,
    color: theme.colors.light.text.secondary,
    marginTop: 2,
  },
  planPrice: {
    fontSize: theme.typography.bodyLg.fontSize,
    fontWeight: '700',
    color: theme.colors.light.brand.primary,
  },
  ctaButton: {
    width: '100%',
    marginBottom: theme.space[2],
  },
  trialNotice: {
    fontSize: theme.typography.captionSm.fontSize,
    color: theme.colors.light.text.muted,
    textAlign: 'center',
    marginBottom: theme.space[4],
  },
  legalRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.space[2],
  },
  legalLink: {
    fontSize: theme.typography.captionSm.fontSize,
    color: theme.colors.light.text.secondary,
  },
  legalDot: {
    fontSize: theme.typography.captionSm.fontSize,
    color: theme.colors.light.text.muted,
  },
});
