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
import { BentoCard } from '../components/BentoCard.js';
import { Button } from '../components/Button.js';
import { PREBUILT_TEMPLATES } from '@dueguard/shared';

export interface OnboardingScreenProps {
  onFinish?: (selectedTemplateIds: string[]) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);

  const steps = [
    {
      step: 1,
      title: 'Calm Over Clutter',
      desc: 'Track all subscriptions, bills, and warranties in one high-trust space without alert fatigue.',
      icon: '🛡️',
    },
    {
      step: 2,
      title: 'Never Miss a Renewal',
      desc: 'Get proactive alerts 30d, 7d, 3d, and 1d before due dates so you never pay late penalties.',
      icon: '⏰',
    },
    {
      step: 3,
      title: 'Cash Spike Radar',
      desc: 'Anticipate lump-sum annual vehicle taxes (STNK) and insurance payments up to 90 days ahead.',
      icon: '📊',
    },
  ];

  const popular = PREBUILT_TEMPLATES.slice(0, 6);

  const toggleTemplate = (id: string) => {
    if (selectedTemplates.includes(id)) {
      setSelectedTemplates(selectedTemplates.filter((t) => t !== id));
    } else {
      setSelectedTemplates([...selectedTemplates, id]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroSection}>
          <Text style={styles.appTitle}>DueGuard</Text>
          <Text style={styles.headline}>Financial Peace of Mind</Text>
        </View>

        {/* 3 Step Cards */}
        {steps.map((s) => (
          <BentoCard key={s.step} style={styles.stepCard}>
            <View style={styles.stepRow}>
              <Text style={styles.stepIcon}>{s.icon}</Text>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>{s.title}</Text>
                <Text style={styles.stepDesc}>{s.desc}</Text>
              </View>
            </View>
          </BentoCard>
        ))}

        {/* Quick Pickers */}
        <Text style={styles.pickTitle}>Select Commitments You Have:</Text>
        <View style={styles.grid}>
          {popular.map((t) => {
            const isSelected = selectedTemplates.includes(t.id);
            return (
              <Pressable
                key={t.id}
                testID={`onboarding-template-${t.id}`}
                onPress={() => toggleTemplate(t.id)}
                style={[
                  styles.chip,
                  isSelected && styles.chipSelected,
                ]}
              >
                <Text style={styles.chipText}>
                  {isSelected ? '✓ ' : '+ '}
                  {t.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Button
          testID="onboarding-get-started"
          title="Get Started"
          size="lg"
          variant="primary"
          onPress={() => onFinish?.(selectedTemplates)}
          style={styles.ctaButton}
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
  content: {
    padding: theme.space[4],
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: theme.space[4],
  },
  appTitle: {
    fontSize: theme.typography.captionSm.fontSize,
    fontWeight: '700',
    color: theme.colors.light.brand.primary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  headline: {
    fontSize: theme.typography.displayLg.fontSize,
    fontWeight: '700',
    color: theme.colors.light.text.primary,
    marginTop: 4,
    textAlign: 'center',
  },
  stepCard: {
    marginBottom: theme.space[3],
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space[3],
  },
  stepIcon: {
    fontSize: 28,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: theme.typography.bodyLg.fontSize,
    fontWeight: '600',
    color: theme.colors.light.text.primary,
  },
  stepDesc: {
    fontSize: theme.typography.bodyMd.fontSize,
    color: theme.colors.light.text.secondary,
    marginTop: 2,
    lineHeight: 18,
  },
  pickTitle: {
    fontSize: theme.typography.bodyMd.fontSize,
    fontWeight: '600',
    color: theme.colors.light.text.primary,
    marginTop: theme.space[4],
    marginBottom: theme.space[2],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space[2],
    marginBottom: theme.space[5],
  },
  chip: {
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[2],
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.light.bg.surface,
    borderWidth: 1,
    borderColor: theme.colors.light.border.subtle,
  },
  chipSelected: {
    borderColor: theme.colors.light.brand.primary,
    backgroundColor: theme.colors.light.brand.primarySoft,
  },
  chipText: {
    fontSize: theme.typography.captionMd.fontSize,
    fontWeight: '500',
    color: theme.colors.light.text.primary,
  },
  ctaButton: {
    width: '100%',
  },
});
