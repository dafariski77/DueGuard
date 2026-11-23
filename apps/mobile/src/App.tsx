import React, { useState } from 'react';
import { SafeAreaView, View, Text, Pressable, StyleSheet } from 'react-native';
import { theme } from './theme/theme.js';
import { HomeScreen, HomeItem } from './screens/HomeScreen.js';
import { QuickAddScreen } from './screens/QuickAddScreen.js';
import { DetailScreen } from './screens/DetailScreen.js';
import { SpendRadarScreen } from './screens/SpendRadarScreen.js';
import { SettingsScreen } from './screens/SettingsScreen.js';
import { OnboardingScreen } from './screens/OnboardingScreen.js';
import { PaywallModal } from './modals/PaywallModal.js';
import { ProofVaultViewer } from './modals/ProofVaultViewer.js';
import { RenewalAffirmationSheet } from './modals/RenewalAffirmationSheet.js';
import { NotificationConsentModal } from './modals/NotificationConsentModal.js';
import { DeleteConsentDialog } from './modals/DeleteConsentDialog.js';
import { Category, BillingCycle } from '@dueguard/shared';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'quickAdd' | 'radar' | 'settings'>('home');
  const [selectedItem, setSelectedItem] = useState<HomeItem | null>(null);

  // Modals state
  const [showPaywall, setShowPaywall] = useState(false);
  const [showNotificationConsent, setShowNotificationConsent] = useState(false);
  const [showDeleteConsent, setShowDeleteConsent] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [viewingAttachment, setViewingAttachment] = useState<{ id: string; fileName: string; viewUrl: string } | null>(null);
  const [renewalAffirmation, setRenewalAffirmation] = useState<{
    itemTitle: string;
    oldDueDate: Date;
    newDueDate: Date;
    amount?: number;
  } | null>(null);

  // Mock User & State
  const [user, setUser] = useState({
    id: 'usr_me',
    email: 'raka@dueguard.app',
    isPro: false,
    activeItemCount: 3,
    maxFreeItems: 7,
  });

  const [items, setItems] = useState<HomeItem[]>([
    {
      id: 'item_1',
      title: 'Netflix',
      category: Category.SUBSCRIPTION,
      amount: 186000,
      billingCycle: BillingCycle.MONTHLY,
      nextDueDate: new Date('2026-04-03'),
      daysRemaining: 3,
    },
    {
      id: 'item_2',
      title: 'IndiHome WiFi',
      category: Category.BILL_ID,
      amount: 385000,
      billingCycle: BillingCycle.MONTHLY,
      nextDueDate: new Date('2026-04-10'),
      daysRemaining: 10,
    },
    {
      id: 'item_3',
      title: 'STNK Mobil Honda HR-V',
      category: Category.BILL_ID,
      amount: 3500000,
      billingCycle: BillingCycle.YEARLY,
      nextDueDate: new Date('2026-05-15'),
      daysRemaining: 45,
    },
  ]);

  const summary = {
    estMonthlySpend: 862667,
    annualizedSpend: 10352000,
    dueThisMonth: 571000,
    upcoming90DaysSpikes: [
      { month: '2026-04', amount: 571000, diffFromAverage: -291667, reasons: [] },
      { month: '2026-05', amount: 4071000, diffFromAverage: 3208333, reasons: ['STNK Mobil Honda HR-V (Rp 3.500.000)'] },
      { month: '2026-06', amount: 571000, diffFromAverage: -291667, reasons: [] },
    ],
    categoryBreakdown: {
      subscriptionPercentage: 22,
      warrantyPercentage: 0,
      billIdPercentage: 78,
    },
  };

  const handleMarkPaid = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    const oldDate = new Date(item.nextDueDate);
    const newDate = new Date(oldDate);
    newDate.setMonth(newDate.getMonth() + 1);

    setItems(items.map((i) => (i.id === itemId ? { ...i, nextDueDate: newDate, daysRemaining: i.daysRemaining + 30 } : i)));

    setRenewalAffirmation({
      itemTitle: item.title,
      oldDueDate: oldDate,
      newDueDate: newDate,
      amount: item.amount,
    });
  };

  const handleSaveNewItem = (data: any) => {
    const newItem: HomeItem = {
      id: `item_${Date.now()}`,
      title: data.title,
      category: data.category,
      billingCycle: data.billingCycle,
      amount: data.amount,
      nextDueDate: data.nextDueDate,
      daysRemaining: Math.round((new Date(data.nextDueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    };
    setItems([...items, newItem]);
    setUser({ ...user, activeItemCount: user.activeItemCount + 1 });
    setCurrentTab('home');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Screen Router */}
      <View style={styles.screenContainer}>
        {showOnboarding ? (
          <OnboardingScreen onFinish={() => setShowOnboarding(false)} />
        ) : selectedItem ? (
          <DetailScreen
            item={{
              ...selectedItem,
              attachments: [{ id: 'att_1', fileName: 'receipt_payment.jpg', viewUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800' }],
            }}
            isPro={user.isPro}
            onBack={() => setSelectedItem(null)}
            onMarkRenewed={() => {
              handleMarkPaid(selectedItem.id);
              setSelectedItem(null);
            }}
            onDelete={() => {
              setItems(items.filter((i) => i.id !== selectedItem.id));
              setUser({ ...user, activeItemCount: Math.max(0, user.activeItemCount - 1) });
              setSelectedItem(null);
            }}
            onViewAttachment={(att) => setViewingAttachment({ id: att.id, fileName: att.fileName, viewUrl: att.viewUrl || '' })}
          />
        ) : currentTab === 'home' ? (
          <HomeScreen
            user={user}
            items={items}
            summary={summary}
            onAddItem={() => setCurrentTab('quickAdd')}
            onSelectItem={(item) => setSelectedItem(item)}
            onMarkPaid={handleMarkPaid}
            onOpenSettings={() => setCurrentTab('settings')}
            onOpenPaywall={() => setShowPaywall(true)}
          />
        ) : currentTab === 'quickAdd' ? (
          <QuickAddScreen
            onCancel={() => setCurrentTab('home')}
            onSave={handleSaveNewItem}
          />
        ) : currentTab === 'radar' ? (
          <SpendRadarScreen summary={summary} />
        ) : (
          <SettingsScreen
            user={user}
            onOpenPaywall={() => setShowPaywall(true)}
            onDeleteAccountPress={() => setShowDeleteConsent(true)}
          />
        )}
      </View>

      {/* Floating Bottom Tab Bar */}
      {!selectedItem && !showOnboarding ? (
        <View style={styles.tabBar}>
          <Pressable
            testID="tab-home"
            onPress={() => setCurrentTab('home')}
            style={[styles.tabItem, currentTab === 'home' && styles.tabItemActive]}
          >
            <Text style={styles.tabIcon}>🏠</Text>
            <Text style={[styles.tabLabel, currentTab === 'home' && styles.tabLabelActive]}>Upcoming</Text>
          </Pressable>

          <Pressable
            testID="tab-quick-add"
            onPress={() => setCurrentTab('quickAdd')}
            style={[styles.tabItem, currentTab === 'quickAdd' && styles.tabItemActive]}
          >
            <Text style={styles.tabIcon}>➕</Text>
            <Text style={[styles.tabLabel, currentTab === 'quickAdd' && styles.tabLabelActive]}>Add</Text>
          </Pressable>

          <Pressable
            testID="tab-radar"
            onPress={() => setCurrentTab('radar')}
            style={[styles.tabItem, currentTab === 'radar' && styles.tabItemActive]}
          >
            <Text style={styles.tabIcon}>📡</Text>
            <Text style={[styles.tabLabel, currentTab === 'radar' && styles.tabLabelActive]}>Radar</Text>
          </Pressable>

          <Pressable
            testID="tab-settings"
            onPress={() => setCurrentTab('settings')}
            style={[styles.tabItem, currentTab === 'settings' && styles.tabItemActive]}
          >
            <Text style={styles.tabIcon}>⚙️</Text>
            <Text style={[styles.tabLabel, currentTab === 'settings' && styles.tabLabelActive]}>Control</Text>
          </Pressable>
        </View>
      ) : null}

      {/* Modals */}
      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        onSubscribe={() => {
          setUser({ ...user, isPro: true });
          setShowPaywall(false);
        }}
      />

      <NotificationConsentModal
        visible={showNotificationConsent}
        onEnable={() => setShowNotificationConsent(false)}
        onDismiss={() => setShowNotificationConsent(false)}
      />

      <DeleteConsentDialog
        visible={showDeleteConsent}
        userEmail={user.email}
        itemCount={items.length}
        attachmentCount={1}
        onCancel={() => setShowDeleteConsent(false)}
        onConfirmDelete={() => {
          setItems([]);
          setUser({ ...user, activeItemCount: 0 });
          setShowDeleteConsent(false);
        }}
      />

      {viewingAttachment ? (
        <ProofVaultViewer
          visible={!!viewingAttachment}
          attachment={viewingAttachment}
          onClose={() => setViewingAttachment(null)}
          onDelete={() => setViewingAttachment(null)}
        />
      ) : null}

      {renewalAffirmation ? (
        <RenewalAffirmationSheet
          visible={!!renewalAffirmation}
          itemTitle={renewalAffirmation.itemTitle}
          oldDueDate={renewalAffirmation.oldDueDate}
          newDueDate={renewalAffirmation.newDueDate}
          amount={renewalAffirmation.amount}
          onUndo={() => setRenewalAffirmation(null)}
          onDone={() => setRenewalAffirmation(null)}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light.bg.canvas,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: theme.colors.light.bg.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.light.border.subtle,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 4,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  tabItemActive: {
    transform: [{ scale: 1.05 }],
  },
  tabIcon: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.light.text.muted,
    marginTop: 2,
  },
  tabLabelActive: {
    color: theme.colors.light.brand.primary,
    fontWeight: '700',
  },
});
