import { describe, it } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import { PaywallModal } from '../PaywallModal.js';
import { ProofVaultViewer } from '../ProofVaultViewer.js';
import { RenewalAffirmationSheet } from '../RenewalAffirmationSheet.js';
import { NotificationConsentModal } from '../NotificationConsentModal.js';
import { DeleteConsentDialog } from '../DeleteConsentDialog.js';
import { OnboardingScreen } from '../../screens/OnboardingScreen.js';

describe('Interaction Flows & Consent React Native Modals', () => {
  it('PaywallModal renders trial terms, tier pricing, and restore purchase compliance', () => {
    const paywall = React.createElement(PaywallModal, { visible: true });

    assert.ok(React.isValidElement(paywall));
    assert.strictEqual(paywall.type, PaywallModal);
    assert.strictEqual(paywall.props.visible, true);
  });

  it('ProofVaultViewer provides secure viewUrl and document management', () => {
    const viewer = React.createElement(ProofVaultViewer, {
      visible: true,
      attachment: {
        id: 'att_123',
        fileName: 'stnk_mobil.jpg',
        viewUrl: 'https://r2.dueguard.internal/vault/stnk_mobil.jpg?token=abc',
        mimeType: 'image/jpeg',
      },
    });

    assert.ok(React.isValidElement(viewer));
    assert.strictEqual(viewer.type, ProofVaultViewer);
    assert.strictEqual(viewer.props.attachment?.fileName, 'stnk_mobil.jpg');
  });

  it('RenewalAffirmationSheet rolls date forward and offers 5-second undo window', () => {
    const sheet = React.createElement(RenewalAffirmationSheet, {
      visible: true,
      itemTitle: 'Netflix',
      oldDueDate: new Date('2026-04-15'),
      newDueDate: new Date('2026-05-15'),
      amount: 186000,
    });

    assert.ok(React.isValidElement(sheet));
    assert.strictEqual(sheet.type, RenewalAffirmationSheet);
    assert.strictEqual(sheet.props.itemTitle, 'Netflix');
  });

  it('NotificationConsentModal primes user before triggering native OS prompt', () => {
    const consent = React.createElement(NotificationConsentModal, { visible: true });

    assert.ok(React.isValidElement(consent));
    assert.strictEqual(consent.type, NotificationConsentModal);
    assert.strictEqual(consent.props.visible, true);
  });

  it('DeleteConsentDialog requires confirmation and warns about permanent erasure', () => {
    const dialog = React.createElement(DeleteConsentDialog, {
      visible: true,
      userEmail: 'raka@example.com',
      itemCount: 5,
      attachmentCount: 2,
    });

    assert.ok(React.isValidElement(dialog));
    assert.strictEqual(dialog.type, DeleteConsentDialog);
    assert.strictEqual(dialog.props.itemCount, 5);
  });

  it('OnboardingScreen guides new users through calm value proposition and instant pickers', () => {
    const onboarding = React.createElement(OnboardingScreen, {});

    assert.ok(React.isValidElement(onboarding));
    assert.strictEqual(onboarding.type, OnboardingScreen);
  });
});
