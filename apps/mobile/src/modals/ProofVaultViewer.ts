export interface ProofVaultViewerProps {
  attachment: {
    id: string;
    fileName: string;
    viewUrl: string;
    mimeType?: string;
  };
}

export function ProofVaultViewer({ attachment }: ProofVaultViewerProps) {
  return {
    type: 'ProofVaultViewer' as const,
    id: attachment.id,
    fileName: attachment.fileName,
    viewUrl: attachment.viewUrl,
    mimeType: attachment.mimeType || 'image/jpeg',
    actions: [
      { id: 'share', label: 'Share Document' },
      { id: 'save', label: 'Save to Photos' },
      { id: 'delete', label: 'Delete Receipt', isDestructive: true },
    ],
  };
}
