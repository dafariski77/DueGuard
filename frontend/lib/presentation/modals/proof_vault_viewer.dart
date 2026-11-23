import 'package:flutter/material.dart';
import '../../core/theme/due_theme.dart';
import '../../data/models/tracked_item.dart';
import '../widgets/bento_card.dart';
import '../widgets/due_button.dart';

class ProofVaultViewer extends StatelessWidget {
  final AttachmentItem attachment;
  final VoidCallback onShare;
  final VoidCallback onDelete;
  final VoidCallback onClose;

  const ProofVaultViewer({
    super.key,
    required this.attachment,
    required this.onShare,
    required this.onDelete,
    required this.onClose,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? DueColors.canvasDark : DueColors.canvas,
      appBar: AppBar(
        title: Text(
          attachment.fileName,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
          ),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        leading: IconButton(
          icon: const Icon(Icons.close_rounded),
          onPressed: onClose,
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            // High-Res Document Preview Box
            Expanded(
              child: BentoCard(
                padding: const EdgeInsets.all(24),
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: isDark ? DueColors.surfaceSubtleDark : DueColors.surfaceSubtle,
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          attachment.mimeType?.contains('pdf') == true
                              ? Icons.picture_as_pdf_rounded
                              : Icons.image_rounded,
                          size: 48,
                          color: DueColors.primary,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        attachment.fileName,
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Securely stored in Proof Vault (Private Bucket)',
                        style: TextStyle(
                          fontSize: 12,
                          color: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Action Buttons
            DueButton(
              title: 'Share Document',
              icon: Icons.share_rounded,
              onPressed: onShare,
              variant: DueButtonVariant.secondary,
            ),
            const SizedBox(height: 10),
            DueButton(
              title: 'Delete Document',
              icon: Icons.delete_outline_rounded,
              onPressed: onDelete,
              variant: DueButtonVariant.danger,
            ),
          ],
        ),
      ),
    );
  }
}
