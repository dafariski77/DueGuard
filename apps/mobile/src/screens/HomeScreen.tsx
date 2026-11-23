import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { theme, formatCurrency, getUrgencyTokens } from '../theme/theme.js';
import { BentoCard } from '../components/BentoCard.js';
import { CountdownBadge } from '../components/CountdownBadge.js';
import { Button } from '../components/Button.js';
import { Category, BillingCycle } from '@dueguard/shared';

export interface HomeItem {
  id: string;
  title: string;
  category: Category;
  amount?: number;
  billingCycle: BillingCycle;
  nextDueDate: Date;
  daysRemaining: number;
}

export interface HomeScreenProps {
  user: {
    isPro: boolean;
    activeItemCount: number;
    maxFreeItems?: number;
  };
  items: HomeItem[];
  summary: {
    estMonthlySpend: number;
    annualizedSpend: number;
    dueThisMonth: number;
  };
  onAddItem?: () => void;
  onSelectItem?: (item: HomeItem) => void;
  onMarkPaid?: (itemId: string) => void;
  onOpenSettings?: () => void;
  onOpenPaywall?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  items,
  summary,
  onAddItem,
  onSelectItem,
  onMarkPaid,
  onOpenSettings,
  onOpenPaywall,
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | Category>('ALL');

  const sorted = [...items].sort((a, b) => a.daysRemaining - b.daysRemaining);
  const heroItem = sorted[0] || null;

  const maxFree = user.maxFreeItems ?? 7;
  const canAddMore = user.isPro || user.activeItemCount < maxFree;

  const filterTabs = [
    { id: 'ALL', label: 'All' },
    { id: Category.SUBSCRIPTION, label: 'Subscriptions' },
    { id: Category.WARRANTY, label: 'Warranties' },
    { id: Category.BILL_ID, label: 'Bills & IDs' },
  ];

  const filteredItems = sorted.filter((item) => {
    if (activeFilter === 'ALL') return true;
    return item.category === activeFilter;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.appTitle}>DueGuard</Text>
          <Text style={styles.appSubtitle}>Calm financial vigilance</Text>
        </View>
        <View style={styles.headerRight}>
          {!user.isPro ? (
            <Pressable
              testID="upgrade-pro-button"
              onPress={onOpenPaywall}
              style={styles.proBadge}
            >
              <Text style={styles.proBadgeText}>PRO</Text>
            </Pressable>
          ) : (
            <View style={styles.proActiveBadge}>
              <Text style={styles.proActiveBadgeText}>PRO ACTIVE</Text>
            </View>
          )}
          <Pressable
            testID="settings-button"
            onPress={onOpenSettings}
            style={styles.avatarButton}
          >
            <Text style={styles.avatarText}>⚙️</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Bento Tile */}
        {heroItem ? (
          <BentoCard variant="hero" style={styles.heroCard}>
            <View style={styles.heroTopRow}>
              <Text style={styles.heroEyebrow}>UP NEXT</Text>
              <CountdownBadge daysRemaining={heroItem.daysRemaining} />
            </View>
            <Text style={styles.heroTitle}>{heroItem.title}</Text>
            <Text style={styles.heroAmount}>
              {formatCurrency(heroItem.amount || 0)}
            </Text>
            <View style={styles.heroActions}>
              <Button
                title="Mark Paid"
                size="md"
                variant="primary"
                onPress={() => onMarkPaid?.(heroItem.id)}
                style={styles.heroButton}
              />
              <Button
                title="Details"
                size="md"
                variant="secondary"
                onPress={() => onSelectItem?.(heroItem)}
                style={styles.heroButton}
              />
            </View>
          </BentoCard>
        ) : (
          <BentoCard style={styles.emptyHeroCard}>
            <Text style={styles.emptyHeroTitle}>All Caught Up</Text>
            <Text style={styles.emptyHeroSubtitle}>
              No upcoming commitments due in the next 30 days.
            </Text>
          </BentoCard>
        )}

        {/* Split Bento Row */}
        <View style={styles.splitRow}>
          <BentoCard style={styles.splitCard}>
            <Text style={styles.splitLabel}>EST. MONTHLY</Text>
            <Text style={styles.splitValue}>
              {formatCurrency(summary.estMonthlySpend)}
            </Text>
            <Text style={styles.splitSub}>
              {formatCurrency(summary.annualizedSpend)} / yr
            </Text>
          </BentoCard>

          <BentoCard style={styles.splitCard}>
            <Text style={styles.splitLabel}>SLOTS</Text>
            <Text style={styles.splitValue}>
              {user.isPro
                ? `${user.activeItemCount}`
                : `${user.activeItemCount} / ${maxFree}`}
            </Text>
            <Text style={styles.splitSub}>
              {user.isPro ? 'Pro Unlimited' : `${maxFree - user.activeItemCount} slots left`}
            </Text>
          </BentoCard>
        </View>

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterBar}
        >
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <Pressable
                key={tab.id}
                testID={`filter-tab-${tab.id}`}
                onPress={() => setActiveFilter(tab.id as any)}
                style={[
                  styles.filterPill,
                  isActive && styles.filterPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    isActive && styles.filterPillTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Timeline Header */}
        <View style={styles.timelineHeader}>
          <Text style={styles.timelineTitle}>Upcoming Commitments</Text>
          <Text style={styles.timelineCount}>{filteredItems.length} items</Text>
        </View>

        {/* Timeline List */}
        {filteredItems.map((item) => (
          <Pressable
            key={item.id}
            testID={`timeline-item-${item.id}`}
            onPress={() => onSelectItem?.(item)}
          >
            <BentoCard style={styles.timelineCard}>
              <View style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDate}>
                    Due {new Date(item.nextDueDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </Text>
                </View>
                <View style={styles.itemRight}>
                  <Text style={styles.itemAmount}>
                    {formatCurrency(item.amount || 0)}
                  </Text>
                  <CountdownBadge daysRemaining={item.daysRemaining} />
                </View>
              </View>
            </BentoCard>
          </Pressable>
        ))}
      </ScrollView>

      {/* Sticky Bottom Floating Action Button */}
      <View style={styles.fabContainer}>
        <Button
          testID="fab-add-item"
          title="+ Add Due Item"
          size="lg"
          variant="primary"
          disabled={!canAddMore}
          onPress={onAddItem}
          style={styles.fab}
        />
      </View>
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
    backgroundColor: theme.colors.light.bg.canvas,
  },
  appTitle: {
    fontSize: theme.typography.headingLg.fontSize,
    fontWeight: theme.typography.headingLg.fontWeight,
    color: theme.colors.light.text.primary,
  },
  appSubtitle: {
    fontSize: theme.typography.captionSm.fontSize,
    color: theme.colors.light.text.secondary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space[2],
  },
  proBadge: {
    backgroundColor: theme.colors.light.brand.primary,
    paddingHorizontal: theme.space[2],
    paddingVertical: theme.space[1],
    borderRadius: theme.radius.sm,
  },
  proBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 11,
  },
  proActiveBadge: {
    backgroundColor: theme.colors.light.status.safeBg,
    paddingHorizontal: theme.space[2],
    paddingVertical: theme.space[1],
    borderRadius: theme.radius.sm,
  },
  proActiveBadgeText: {
    color: theme.colors.light.status.safeText,
    fontWeight: '700',
    fontSize: 10,
  },
  avatarButton: {
    padding: theme.space[1],
  },
  avatarText: {
    fontSize: 20,
  },
  scrollContent: {
    padding: theme.space[4],
    paddingBottom: 100,
  },
  heroCard: {
    marginBottom: theme.space[4],
  },
  emptyHeroCard: {
    marginBottom: theme.space[4],
    alignItems: 'center',
    paddingVertical: theme.space[6],
  },
  emptyHeroTitle: {
    fontSize: theme.typography.headingMd.fontSize,
    fontWeight: '600',
    color: theme.colors.light.text.primary,
  },
  emptyHeroSubtitle: {
    fontSize: theme.typography.bodyMd.fontSize,
    color: theme.colors.light.text.secondary,
    marginTop: theme.space[1],
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.space[2],
  },
  heroEyebrow: {
    fontSize: theme.typography.captionSm.fontSize,
    fontWeight: '700',
    color: theme.colors.light.brand.primary,
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: theme.typography.headingLg.fontSize,
    fontWeight: '700',
    color: theme.colors.light.text.primary,
  },
  heroAmount: {
    fontSize: theme.typography.displayLg.fontSize,
    fontWeight: '700',
    color: theme.colors.light.text.primary,
    fontVariant: ['tabular-nums'],
    marginVertical: theme.space[2],
  },
  heroActions: {
    flexDirection: 'row',
    gap: theme.space[2],
    marginTop: theme.space[2],
  },
  heroButton: {
    flex: 1,
  },
  splitRow: {
    flexDirection: 'row',
    gap: theme.space[3],
    marginBottom: theme.space[4],
  },
  splitCard: {
    flex: 1,
  },
  splitLabel: {
    fontSize: theme.typography.captionSm.fontSize,
    fontWeight: '600',
    color: theme.colors.light.text.secondary,
    letterSpacing: 0.5,
  },
  splitValue: {
    fontSize: theme.typography.headingMd.fontSize,
    fontWeight: '700',
    color: theme.colors.light.text.primary,
    fontVariant: ['tabular-nums'],
    marginVertical: theme.space[1],
  },
  splitSub: {
    fontSize: theme.typography.captionSm.fontSize,
    color: theme.colors.light.text.muted,
  },
  filterBar: {
    flexDirection: 'row',
    gap: theme.space[2],
    marginBottom: theme.space[4],
  },
  filterPill: {
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[2],
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.light.bg.surfaceSubtle,
  },
  filterPillActive: {
    backgroundColor: theme.colors.light.brand.primary,
  },
  filterPillText: {
    fontSize: theme.typography.captionMd.fontSize,
    fontWeight: '500',
    color: theme.colors.light.text.secondary,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.space[2],
  },
  timelineTitle: {
    fontSize: theme.typography.headingMd.fontSize,
    fontWeight: '600',
    color: theme.colors.light.text.primary,
  },
  timelineCount: {
    fontSize: theme.typography.captionMd.fontSize,
    color: theme.colors.light.text.muted,
  },
  timelineCard: {
    marginBottom: theme.space[2],
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: theme.typography.bodyLg.fontSize,
    fontWeight: '600',
    color: theme.colors.light.text.primary,
  },
  itemDate: {
    fontSize: theme.typography.captionMd.fontSize,
    color: theme.colors.light.text.secondary,
    marginTop: 2,
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  itemAmount: {
    fontSize: theme.typography.bodyLg.fontSize,
    fontWeight: '600',
    color: theme.colors.light.text.primary,
    fontVariant: ['tabular-nums'],
  },
  fabContainer: {
    position: 'absolute',
    bottom: theme.space[5],
    left: theme.space[4],
    right: theme.space[4],
  },
  fab: {
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
});
