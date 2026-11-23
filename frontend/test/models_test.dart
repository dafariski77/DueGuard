import 'package:flutter_test/flutter_test.dart';
import 'package:dueguard/data/models/enums.dart';
import 'package:dueguard/data/models/tracked_item.dart';
import 'package:dueguard/data/models/analytics_summary.dart';
import 'package:dueguard/core/constants/templates.dart';

void main() {
  group('Enums & Domain Models', () {
    test('serializes and deserializes TrackedItem to and from JSON', () {
      final json = {
        'id': 'item_netflix',
        'title': 'Netflix Premium',
        'category': 'SUBSCRIPTION',
        'amount': '186000.00',
        'billingCycle': 'MONTHLY',
        'nextDueDate': '2026-04-15T00:00:00.000Z',
        'reminderDaysBefore': [7, 3, 1],
        'notes': 'Family plan',
        'status': 'ACTIVE',
        'attachments': [
          {'id': 'att_1', 'fileName': 'receipt.jpg'}
        ]
      };

      final item = TrackedItem.fromJson(json);

      expect(item.id, 'item_netflix');
      expect(item.title, 'Netflix Premium');
      expect(item.category, Category.subscription);
      expect(item.amount, 186000.0);
      expect(item.billingCycle, BillingCycle.monthly);
      expect(item.status, ItemStatus.active);
      expect(item.reminderDaysBefore, [7, 3, 1]);
      expect(item.attachments.length, 1);

      final exported = item.toJson();
      expect(exported['title'], 'Netflix Premium');
      expect(exported['category'], 'SUBSCRIPTION');
      expect(exported['billingCycle'], 'MONTHLY');
    });

    test('serializes AnalyticsSummary from backend API response', () {
      final json = {
        'estMonthlySpend': 485000,
        'annualizedSpend': 5820000,
        'dueThisMonth': 385000,
        'upcoming90DaysSpikes': [
          {
            'month': '2026-05',
            'amount': 3885000,
            'diffFromAverage': 3400000,
            'reasons': ['STNK Mobil Pajak Tahunan']
          }
        ],
        'categoryBreakdown': {
          'subscriptionPercentage': 35,
          'warrantyPercentage': 5,
          'billIdPercentage': 60
        }
      };

      final summary = AnalyticsSummary.fromJson(json);

      expect(summary.estMonthlySpend, 485000);
      expect(summary.annualizedSpend, 5820000);
      expect(summary.dueThisMonth, 385000);
      expect(summary.upcoming90DaysSpikes.length, 1);
      expect(summary.upcoming90DaysSpikes.first.isSpike, true);
      expect(summary.categoryBreakdown.billIdPercentage, 60);
    });

    test('prebuiltTemplates contains at least 30 valid templates', () {
      expect(prebuiltTemplates.length, greaterThanOrEqualTo(30));
      for (final t in prebuiltTemplates) {
        expect(t.id.isNotEmpty, true);
        expect(t.name.isNotEmpty, true);
        expect(t.defaultRemindDaysBefore.isNotEmpty, true);
      }
    });
  });
}
