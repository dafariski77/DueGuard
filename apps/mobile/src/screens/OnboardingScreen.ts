import { PREBUILT_TEMPLATES } from '@dueguard/shared';

export function OnboardingScreen() {
  const steps = [
    {
      step: 1,
      title: 'Calm Over Clutter',
      description:
        'Track all your subscriptions, bills, and warranties in one high-trust space without financial anxiety.',
    },
    {
      step: 2,
      title: 'Never Miss a Renewal',
      description:
        'Smart multi-stage alerts 30d, 7d, 3d, and 1d before due dates so you are never caught off-guard.',
    },
    {
      step: 3,
      title: 'Cash Spike Radar',
      description:
        'Anticipate lump-sum annual vehicle taxes, insurance, and warranty expirations up to 90 days ahead.',
    },
  ];

  const popularTemplates = PREBUILT_TEMPLATES.slice(0, 6).map((t) => ({
    id: t.id,
    name: t.name,
    category: t.category,
    icon: t.icon,
  }));

  return {
    type: 'OnboardingScreen' as const,
    steps,
    popularTemplates,
    ctaLabel: 'Get Started',
  };
}
