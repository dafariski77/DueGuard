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
}

export function SettingsScreen({
  user,
  settings = {},
}: SettingsScreenProps) {
  return {
    type: 'SettingsScreen' as const,
    header: {
      title: 'Control Center',
    },
    profile: {
      email: user.email,
      isPro: user.isPro,
      tierBadge: user.isPro ? 'Pro Active' : 'Free Tier',
    },
    security: {
      faceIdEnabled: settings.faceIdEnabled ?? false,
      label: 'Require Face ID / Touch ID on Launch',
    },
    notifications: {
      pushEnabled: settings.pushEnabled ?? true,
      digestTime: settings.digestTime ?? '09:00',
    },
    compliance: {
      restorePurchasesLabel: 'Restore Purchases',
      privacyPolicyUrl: 'https://dueguard.app/privacy',
      termsUrl: 'https://dueguard.app/terms',
      hasDeleteAccountButton: true,
      deleteAccountLabel: 'Delete Account & Erase Data',
    },
  };
}
