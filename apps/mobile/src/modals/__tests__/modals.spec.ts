import { describe, it } from 'node:test';
import assert from 'node:assert';
import { PaywallModal } from '../PaywallModal.js';
import { ProofVaultViewer } from '../ProofVaultViewer.js';
import { RenewalAffirmationSheet } from '../RenewalAffirmationSheet.js';
import { NotificationConsentModal } from '../NotificationConsentModal.js';
import { DeleteConsentDialog } from '../DeleteConsentDialog.js';
import { OnboardingScreen } from '../../screens/OnboardingScreen.js';

describe('Interaction Flows & Consent Modals', () => {
  it('PaywallModal contains trial terms, tier pricing, and restore purchase compliance', () => {
    const paywall = PaywallModal({ selectedPlan: 'annual' });

    assert.strictEqual(paywall.type, 'PaywallModal');
    assert.ok(paywall.features.length >= 4, 'Must list key Pro features');
    assert.ok(paywall.trialNotice.includes('7-Day Free Trial'));
    assert.strictEqual(paywall.ctaLabel, 'Start 7-Day Free Trial');
    assert.ok(paywall.hasRestorePurchases, 'Must have Restore Purchases button for App Store review');
  });

  it('ProofVaultViewer provides secure viewUrl and document management', () => {
    const viewer = ProofVaultViewer({
      attachment: {
        id: 'att_123',
        fileName: 'stnk_mobil.jpg',
        viewUrl: 'https://r2.dueguard.internal/vault/stnk_mobil.jpg?token=abc',
        mimeType: 'image/jpeg',
      },
    });

    assert.strictEqual(viewer.type, 'ProofVaultViewer');
    assert.strictEqual(viewer.fileName, 'stnk_mobil.jpg');
    assert.ok(viewer.viewUrl.includes('token=abc'));
    assert.ok(viewer.actions.some((a: any) => a.id === 'delete'));
    assert.ok(viewer.actions.some((a: any) => a.id === 'share'));
  });

  it('RenewalAffirmationSheet rolls date forward and offers 5-second undo window', () => {
    const sheet = RenewalAffirmationSheet({
      itemTitle: 'Netflix',
      oldDueDate: new Date('2026-04-15'),
      newDueDate: new Date('2026-05-15'),
      amount: 186000,
    });

    assert.strictEqual(sheet.type, 'RenewalAffirmationSheet');
    assert.strictEqual(sheet.undoTimeoutSeconds, 5);
    assert.strictEqual(sheet.canUndo, true);
    assert.match(sheet.rolledDateFormatted, /Mei/); // Indonesian month
  });

  it('NotificationConsentModal primes user before triggering native OS prompt', () => {
    const consent = NotificationConsentModal();

    assert.strictEqual(consent.type, 'NotificationConsentModal');
    assert.ok(consent.headline.includes('Alert'));
    assert.ok(consent.reasons.length >= 3);
    assert.strictEqual(consent.primaryAction.label, 'Enable Notifications');
    assert.strictEqual(consent.secondaryAction.label, 'Maybe Later');
  });

  it('DeleteConsentDialog requires confirmation and warns about permanent erasure', () => {
    const dialog = DeleteConsentDialog({
      userEmail: 'raka@example.com',
      itemCount: 5,
      attachmentCount: 2,
    });

    assert.strictEqual(dialog.type, 'DeleteConsentDialog');
    assert.strictEqual(dialog.isDestructive, true);
    assert.match(dialog.warningMessage, /permanent and cannot be undone/);
    assert.strictEqual(dialog.requiredConfirmationText, 'DELETE');
  });

  it('OnboardingScreen guides new users through calm value proposition and instant pickers', () => {
    const onboarding = OnboardingScreen();

    assert.strictEqual(onboarding.type, 'OnboardingScreen');
    assert.strictEqual(onboarding.steps.length, 3);
    assert.ok(onboarding.popularTemplates.length >= 5);
    assert.strictEqual(onboarding.ctaLabel, 'Get Started');
  });
});
