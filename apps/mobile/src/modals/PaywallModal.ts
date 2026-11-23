export interface PaywallModalProps {
  selectedPlan?: 'annual' | 'monthly';
}

export function PaywallModal({ selectedPlan = 'annual' }: PaywallModalProps = {}) {
  const plans = [
    {
      id: 'annual',
      title: 'Annual Plan',
      price: 'Rp 199.000 / year',
      periodNote: 'Rp 16.583 / month (Save 42%)',
      badge: 'Best Value',
      hasTrial: true,
      trialDurationDays: 7,
    },
    {
      id: 'monthly',
      title: 'Monthly Plan',
      price: 'Rp 29.000 / month',
      periodNote: 'Billed monthly, cancel anytime',
      badge: null,
      hasTrial: false,
    },
  ];

  const features = [
    { id: 'unlimited', title: 'Unlimited Due Items', desc: 'Remove 7-item free tier restriction' },
    { id: 'multistage', title: 'Multi-Stage Smart Alerts', desc: 'Get alerts at 30d, 7d, 3d, and 1d' },
    { id: 'vault', title: 'Unlimited Proof Vault', desc: 'Secure cloud storage for receipts & IDs' },
    { id: 'radar', title: '90-Day Cash Spike Radar', desc: 'Anticipate lump-sum tax and warranty peaks' },
    { id: 'biometrics', title: 'Face ID & App Lock', desc: 'Protect financial privacy with biometric gate' },
  ];

  const activePlan = plans.find((p) => p.id === selectedPlan) || plans[0];

  return {
    type: 'PaywallModal' as const,
    header: {
      title: 'Upgrade to DueGuard Pro',
      subtitle: 'Never pay another late fee. Total peace of mind.',
    },
    features,
    plans,
    selectedPlan: activePlan.id,
    trialNotice: 'Includes 7-Day Free Trial. Cancel anytime in App Store settings.',
    ctaLabel: activePlan.hasTrial ? 'Start 7-Day Free Trial' : 'Subscribe Now',
    hasRestorePurchases: true,
    restorePurchasesLabel: 'Restore Purchases',
    legalNotice: 'Payment will be charged to your Apple ID / Google Play account upon confirmation.',
  };
}
