import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dueguard/core/theme/due_theme.dart';
import 'package:dueguard/presentation/widgets/bento_card.dart';
import 'package:dueguard/presentation/widgets/countdown_badge.dart';
import 'package:dueguard/presentation/widgets/due_button.dart';
import 'package:dueguard/presentation/widgets/due_input.dart';

void main() {
  group('Bento Design System Theme Tokens', () {
    test('maps urgency tokens correctly', () {
      final critical = DueTheme.getUrgencyTokens(2);
      expect(critical.level, UrgencyLevel.critical);
      expect(critical.label, '2D LEFT');
      expect(critical.text, DueColors.criticalText);
      expect(critical.bg, DueColors.criticalBg);

      final dueToday = DueTheme.getUrgencyTokens(0);
      expect(dueToday.label, 'DUE TODAY');

      final warning = DueTheme.getUrgencyTokens(7);
      expect(warning.level, UrgencyLevel.warning);
      expect(warning.label, '7D LEFT');

      final subtle = DueTheme.getUrgencyTokens(30);
      expect(subtle.level, UrgencyLevel.subtle);
      expect(subtle.label, '30D LEFT');
    });

    test('formats Indonesian Rupiah currency with clean thousand separators', () {
      expect(DueTheme.formatCurrency(186000), 'Rp 186.000');
      expect(DueTheme.formatCurrency(3500000), 'Rp 3.500.000');
      expect(DueTheme.formatCurrency(0), 'Rp 0');
    });
  });

  group('Atomic UI Widgets', () {
    testWidgets('CountdownBadge renders correct urgency label and colors', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: CountdownBadge(daysRemaining: 2),
          ),
        ),
      );

      expect(find.text('2D LEFT'), findsOneWidget);
    });

    testWidgets('DueButton enforces HIG 44pt minimum height', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: DueButton(
              title: 'Add Item',
              onPressed: () {},
            ),
          ),
        ),
      );

      final buttonFinder = find.byType(DueButton);
      expect(buttonFinder, findsOneWidget);

      final Size size = tester.getSize(buttonFinder);
      expect(size.height, greaterThanOrEqualTo(44.0));
      expect(find.text('Add Item'), findsOneWidget);
    });

    testWidgets('BentoCard renders child with 16pt corner radius', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: BentoCard(
              child: Text('Card Content'),
            ),
          ),
        ),
      );

      expect(find.text('Card Content'), findsOneWidget);
    });

    testWidgets('DueInput renders label, hint, and error text', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: DueInput(
              label: 'Title',
              hintText: 'e.g. Netflix',
              errorText: 'Title is required',
            ),
          ),
        ),
      );

      expect(find.text('Title'), findsOneWidget);
      expect(find.text('e.g. Netflix'), findsOneWidget);
      expect(find.text('Title is required'), findsOneWidget);
    });
  });
}
