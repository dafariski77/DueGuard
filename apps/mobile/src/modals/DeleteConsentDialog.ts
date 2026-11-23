export interface DeleteConsentDialogProps {
  userEmail: string;
  itemCount: number;
  attachmentCount: number;
}

export function DeleteConsentDialog({
  userEmail,
  itemCount,
  attachmentCount,
}: DeleteConsentDialogProps) {
  return {
    type: 'DeleteConsentDialog' as const,
    headline: 'Permanently Erase Account & All Data?',
    warningMessage:
      'This action is permanent and cannot be undone. All your tracked subscriptions, bills, and Proof Vault receipts will be immediately erased.',
    isDestructive: true,
    consequences: [
      `Permanently delete ${itemCount} tracked items and commitment history.`,
      `Permanently purge ${attachmentCount} receipt and document files from secure storage.`,
      'Revoke active session and cancel scheduled push notifications.',
    ],
    userEmail,
    requiredConfirmationText: 'DELETE',
    destructiveAction: {
      id: 'confirm_deletion',
      label: 'Delete Account & Erase All Data',
      variant: 'danger',
    },
    cancelAction: {
      id: 'cancel',
      label: 'Keep Account',
      variant: 'ghost',
    },
  };
}
