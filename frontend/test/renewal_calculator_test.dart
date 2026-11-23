import 'package:flutter_test/flutter_test.dart';
import 'package:dueguard/core/utils/renewal_calculator.dart';
import 'package:dueguard/data/models/enums.dart';

void main() {
  group('RenewalCalculator Strategy & Month Clamping (Flutter)', () {
    test('correctly calculates max days in months including leap years', () {
      expect(getDaysInMonth(2024, 2), 29); // 2024 is leap year
      expect(getDaysInMonth(2025, 2), 28); // 2025 is non-leap year
      expect(getDaysInMonth(2026, 1), 31);
      expect(getDaysInMonth(2026, 4), 30);
    });

    test('prevents month overflow drift by clamping Jan 31st to Feb 28th (non-leap)', () {
      final jan31 = DateTime(2025, 1, 31, 10, 0);
      final nextDue = RenewalCalculator.calculateNextDueDate(BillingCycle.monthly, jan31);

      expect(nextDue.year, 2025);
      expect(nextDue.month, 2); // February
      expect(nextDue.day, 28, reason: 'Must clamp to Feb 28th instead of overflowing to March');
    });

    test('clamps Jan 31st to Feb 29th on leap years', () {
      final jan31 = DateTime(2024, 1, 31, 10, 0);
      final nextDue = RenewalCalculator.calculateNextDueDate(BillingCycle.monthly, jan31);

      expect(nextDue.year, 2024);
      expect(nextDue.month, 2);
      expect(nextDue.day, 29, reason: 'Must clamp to Feb 29th on leap year');
    });

    test('quarterly renewal clamps end-of-month correctly', () {
      final nov30 = DateTime(2025, 11, 30);
      final nextDue = RenewalCalculator.calculateNextDueDate(BillingCycle.quarterly, nov30);

      expect(nextDue.year, 2026);
      expect(nextDue.month, 2);
      expect(nextDue.day, 28);
    });

    test('yearly renewal clamps leap day correctly on non-leap year', () {
      final leapDay = DateTime(2024, 2, 29);
      final nextDue = RenewalCalculator.calculateNextDueDate(BillingCycle.yearly, leapDay);

      expect(nextDue.year, 2025);
      expect(nextDue.month, 2);
      expect(nextDue.day, 28);
    });
  });
}
