export function NotificationConsentModal() {
  return {
    type: 'NotificationConsentModal' as const,
    headline: 'Timely Alerts Before You Incur Late Fees',
    body: 'DueGuard only sends actionable notifications when an upcoming subscription or bill requires attention.',
    reasons: [
      '30-day heads-up for annual bills like STNK and insurance',
      '7-day and 3-day reminder to review payment or cancel',
      '1-day final alert on the day of renewal',
    ],
    primaryAction: {
      id: 'enable_push',
      label: 'Enable Notifications',
    },
    secondaryAction: {
      id: 'dismiss',
      label: 'Maybe Later',
    },
  };
}
