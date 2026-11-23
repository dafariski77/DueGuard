import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dueguard/data/models/tracked_item.dart';
import 'package:dueguard/presentation/modals/paywall_modal.dart';
import 'package:dueguard/presentation/modals/proof_vault_viewer.dart';
import 'package:dueguard/presentation/modals/renewal_affirmation_sheet.dart';
import 'package:dueguard/presentation/modals/notification_consent_modal.dart';
import 'package:dueguard/presentation/modals/delete_consent_dialog.dart';
import 'package:dueguard/presentation/screens/onboarding_screen.dart';

void main() {
  final sampleAttachment = const AttachmentItem(
    id: 'att-1',
    fileName: 'vehicle_registration_stnk.pdf',
    viewUrl: 'https://storage.dueguard.com/stnk.pdf',
    mimeType: 'application/pdf',
  );

  group('Screen 7: PaywallModal', () {
    testWidgets('renders annual plan with trial, feature list, and subscribe button', (tester) async {
      tester.view.physicalSize = const Size(1000, 3000);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      bool subscribed = false;
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: PaywallModal(
              onSubscribe: (plan) {
                subscribed = true;
              },
              onRestore: () {},
              onClose: () {},
            ),
          ),
        ),
      );

      expect(find.text('Unlock DueGuard Pro'), findsOneWidget);
      expect(find.text('7-Day Free Trial'), findsWidgets);
      expect(find.text('Rp 249.000 / year'), findsOneWidget);
      expect(find.text('Start 7-Day Free Trial'), findsOneWidget);

      await tester.tap(find.text('Start 7-Day Free Trial'));
      await tester.pump();
      expect(subscribed, isTrue);
    });
  });

  group('Screen 8: ProofVaultViewer', () {
    testWidgets('renders filename, share action, and delete document button', (tester) async {
      tester.view.physicalSize = const Size(1000, 3000);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      bool deleted = false;
      bool shared = false;
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ProofVaultViewer(
              attachment: sampleAttachment,
              onShare: () {
                shared = true;
              },
              onDelete: () {
                deleted = true;
              },
              onClose: () {},
            ),
          ),
        ),
      );

      expect(find.text('vehicle_registration_stnk.pdf'), findsWidgets);
      expect(find.text('Share Document'), findsOneWidget);
      expect(find.text('Delete Document'), findsOneWidget);

      await tester.tap(find.text('Share Document'));
      await tester.pump();
      expect(shared, isTrue);

      await tester.tap(find.text('Delete Document'));
      await tester.pump();
      expect(deleted, isTrue);
    });
  });

  group('Screen 9: RenewalAffirmationSheet', () {
    testWidgets('renders rolled due date and 5-second undo button', (tester) async {
      tester.view.physicalSize = const Size(1000, 3000);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      bool undone = false;
      final rolledDate = DateTime(2026, 4, 15);

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: RenewalAffirmationSheet(
              itemTitle: 'Netflix',
              newDueDate: rolledDate,
              onUndo: () {
                undone = true;
              },
              onDismiss: () {},
            ),
          ),
        ),
      );

      expect(find.text('Item Renewed!'), findsOneWidget);
      expect(find.text('Next due date: 15/4/2026'), findsOneWidget);
      expect(find.textContaining('Undo'), findsOneWidget);

      await tester.tap(find.textContaining('Undo'));
      await tester.pump();
      expect(undone, isTrue);
    });
  });

  group('Screen 10: NotificationConsentModal', () {
    testWidgets('renders 4 notification stages and permission actions', (tester) async {
      tester.view.physicalSize = const Size(1000, 3000);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      bool accepted = false;
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: NotificationConsentModal(
              onAccept: () {
                accepted = true;
              },
              onDismiss: () {},
            ),
          ),
        ),
      );

      expect(find.text('Never Miss a Renewal'), findsOneWidget);
      expect(find.text('30 days before'), findsOneWidget);
      expect(find.text('7 days before'), findsOneWidget);
      expect(find.text('Enable Notifications'), findsOneWidget);

      await tester.tap(find.text('Enable Notifications'));
      await tester.pump();
      expect(accepted, isTrue);
    });
  });

  group('Screen 11: DeleteConsentDialog', () {
    testWidgets('requires confirmation before triggering account deletion', (tester) async {
      tester.view.physicalSize = const Size(1000, 3000);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      bool confirmedDelete = false;
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: DeleteConsentDialog(
              onConfirmDelete: () {
                confirmedDelete = true;
              },
              onCancel: () {},
            ),
          ),
        ),
      );

      expect(find.text('Delete Account?'), findsOneWidget);
      expect(find.textContaining('cannot be undone'), findsOneWidget);
      expect(find.text('Permanently Delete'), findsOneWidget);

      await tester.tap(find.text('Permanently Delete'));
      await tester.pump();
      expect(confirmedDelete, isTrue);
    });
  });

  group('Screen 12: OnboardingScreen', () {
    testWidgets('renders value carousel and starter template selector', (tester) async {
      tester.view.physicalSize = const Size(1000, 3000);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      bool completed = false;
      await tester.pumpWidget(
        MaterialApp(
          home: OnboardingScreen(
            onComplete: (selectedTemplates) {
              completed = true;
            },
          ),
        ),
      );

      expect(find.text('Welcome to DueGuard'), findsOneWidget);
      expect(find.text('Get Started'), findsOneWidget);

      await tester.tap(find.text('Get Started'));
      await tester.pumpAndSettle();
      expect(completed, isTrue);
    });
  });
}
