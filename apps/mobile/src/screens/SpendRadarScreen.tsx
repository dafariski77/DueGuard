import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from 'react-native';
import { theme, formatCurrency } from '../theme/theme.js';
import { BentoCard } from '../components/BentoCard.js';
import { AnalyticsSummaryDto } from '@dueguard/shared';

export interface SpendRadarScreenProps {
  summary: AnalyticsSummaryDto;
}

export const SpendRadarScreen: React.FC<SpendRadarScreenProps> = ({ summary }) => {
  const spikes = summary.upcoming90DaysSpikes || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Spend Radar</Text>
        <Text style={styles.headerSubtitle}>90-Day liquidity intelligence</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Run-rate Hero */}
        <BentoCard variant="hero" style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>EST. MONTHLY RUN-RATE</Text>
          <Text testID="hero-monthly-rate" style={styles.heroAmount}>
            {formatCurrency(summary.estMonthlySpend)}
          </Text>
          <View style={styles.heroRow}>
            <Text style={styles.heroSub}>
              Annual Commitment: {formatCurrency(summary.annualizedSpend)}
            </Text>
            <Text style={styles.heroSub}>
              Due This Month: {formatCurrency(summary.dueThisMonth)}
            </Text>
          </View>
        </BentoCard>

        {/* 90-Day Cash Spike Radar */}
        <Text style={styles.sectionTitle}>90-Day Cash Spike Radar</Text>
        <Text style={styles.sectionSubtitle}>
          Anticipates annual lump-sum spikes like STNK, taxes, and insurance.
        </Text>

        <View style={styles.spikesContainer}>
          {spikes.map((spike) => {
            const isSpike = spike.diffFromAverage > 0 && spike.reasons.length > 0;
            return (
              <BentoCard
                key={spike.month}
                testID={`spike-card-${spike.month}`}
                variant={isSpike ? 'highlight' : 'standard'}
                style={styles.spikeCard}
              >
                <View style={styles.spikeTop}>
                  <Text style={styles.spikeMonth}>{spike.month}</Text>
                  {isSpike ? (
                    <View style={styles.spikeBadge}>
                      <Text style={styles.spikeBadgeText}>
                        +{formatCurrency(spike.diffFromAverage)} SPIKE
                      </Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.spikeAmount}>
                  {formatCurrency(spike.amount)}
                </Text>
                {spike.reasons.length > 0 ? (
                  <View style={styles.reasonsContainer}>
                    {spike.reasons.map((reason, idx) => (
                      <Text key={idx} style={styles.reasonText}>
                        ⚠️ {reason}
                      </Text>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.normalNote}>Standard monthly recurring run-rate</Text>
                )}
              </BentoCard>
            );
          })}
        </View>

        {/* Category Breakdown */}
        <Text style={styles.sectionTitle}>Category Allocation</Text>
        <BentoCard style={styles.breakdownCard}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Subscriptions</Text>
            <Text style={styles.breakdownValue}>
              {summary.categoryBreakdown.subscriptionPercentage}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${summary.categoryBreakdown.subscriptionPercentage}%`,
                  backgroundColor: theme.colors.light.category.subscriptionText,
                },
              ]}
            />
          </View>

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Bills & Civic IDs</Text>
            <Text style={styles.breakdownValue}>
              {summary.categoryBreakdown.billIdPercentage}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${summary.categoryBreakdown.billIdPercentage}%`,
                  backgroundColor: theme.colors.light.category.billIdText,
                },
              ]}
            />
          </View>

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Warranties</Text>
            <Text style={styles.breakdownValue}>
              {summary.categoryBreakdown.warrantyPercentage}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${summary.categoryBreakdown.warrantyPercentage}%`,
                  backgroundColor: theme.colors.light.category.warrantyText,
                },
              ]}
            />
          </View>
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
  headerSubtitle: {
    fontSize: theme.typography.captionSm.fontSize,
    color: theme.colors.light.text.secondary,
  },
  content: {
    padding: theme.space[4],
    paddingBottom: 40,
  },
  heroCard: {
    marginBottom: theme.space[4],
  },
  heroEyebrow: {
    fontSize: theme.typography.captionSm.fontSize,
    fontWeight: '700',
    color: theme.colors.light.brand.primary,
    letterSpacing: 0.5,
  },
  heroAmount: {
    fontSize: theme.typography.displayLg.fontSize,
    fontWeight: '700',
    color: theme.colors.light.text.primary,
    fontVariant: ['tabular-nums'],
    marginVertical: theme.space[1],
  },
  heroRow: {
    gap: 4,
    marginTop: theme.space[2],
  },
  heroSub: {
    fontSize: theme.typography.captionMd.fontSize,
    color: theme.colors.light.text.secondary,
  },
  sectionTitle: {
    fontSize: theme.typography.headingMd.fontSize,
    fontWeight: '700',
    color: theme.colors.light.text.primary,
    marginTop: theme.space[2],
  },
  sectionSubtitle: {
    fontSize: theme.typography.captionMd.fontSize,
    color: theme.colors.light.text.secondary,
    marginBottom: theme.space[3],
  },
  spikesContainer: {
    gap: theme.space[2],
    marginBottom: theme.space[4],
  },
  spikeCard: {
    padding: theme.space[3],
  },
  spikeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  spikeMonth: {
    fontSize: theme.typography.bodyMd.fontSize,
    fontWeight: '600',
    color: theme.colors.light.text.primary,
  },
  spikeBadge: {
    backgroundColor: theme.colors.light.status.warningBg,
    paddingHorizontal: theme.space[2],
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
  },
  spikeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.light.status.warningText,
  },
  spikeAmount: {
    fontSize: theme.typography.headingMd.fontSize,
    fontWeight: '700',
    color: theme.colors.light.text.primary,
    fontVariant: ['tabular-nums'],
  },
  reasonsContainer: {
    marginTop: theme.space[2],
  },
  reasonText: {
    fontSize: theme.typography.captionMd.fontSize,
    color: theme.colors.light.status.warningText,
  },
  normalNote: {
    fontSize: theme.typography.captionSm.fontSize,
    color: theme.colors.light.text.muted,
    marginTop: 4,
  },
  breakdownCard: {
    marginTop: theme.space[2],
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.space[2],
    marginBottom: 4,
  },
  breakdownLabel: {
    fontSize: theme.typography.bodyMd.fontSize,
    color: theme.colors.light.text.secondary,
  },
  breakdownValue: {
    fontSize: theme.typography.bodyMd.fontSize,
    fontWeight: '600',
    color: theme.colors.light.text.primary,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.light.bg.surfaceSubtle,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});
