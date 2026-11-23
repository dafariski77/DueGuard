import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:dueguard/core/network/api_client.dart';
import 'package:dueguard/data/models/enums.dart';
import 'package:dueguard/data/models/tracked_item.dart';
import 'package:dueguard/data/repositories/items_repository.dart';
import 'package:dueguard/data/repositories/analytics_repository.dart';

void main() {
  group('ApiClient & Repositories', () {
    test('ItemsRepository fetches and parses tracked items list from NestJS backend', () async {
      final mockHttpClient = MockClient((request) async {
        expect(request.url.path, '/items');
        expect(request.headers['Authorization'], 'Bearer test_token');
        expect(request.headers['Content-Type'], 'application/json');

        final responseBody = [
          {
            'id': 'item-101',
            'title': 'Netflix Premium',
            'category': 'SUBSCRIPTION',
            'amount': 186000,
            'billingCycle': 'MONTHLY',
            'nextDueDate': '2026-04-01T00:00:00.000Z',
            'reminderDaysBefore': [7, 3, 1],
            'status': 'ACTIVE',
            'attachments': [],
          }
        ];

        return http.Response(jsonEncode(responseBody), 200, headers: {
          'content-type': 'application/json',
        });
      });

      final apiClient = ApiClient(
        baseUrl: 'http://localhost:3000',
        client: mockHttpClient,
        authToken: 'test_token',
      );

      final itemsRepo = ItemsRepository(apiClient);
      final items = await itemsRepo.getItems();

      expect(items.length, 1);
      expect(items.first.id, 'item-101');
      expect(items.first.title, 'Netflix Premium');
      expect(items.first.category, Category.subscription);
      expect(items.first.billingCycle, BillingCycle.monthly);
      expect(items.first.amount, 186000);
    });

    test('ItemsRepository calls renewItem endpoint and parses updated item', () async {
      final mockHttpClient = MockClient((request) async {
        expect(request.url.path, '/items/item-101/renew');
        expect(request.method, 'POST');

        final responseBody = {
          'id': 'item-101',
          'title': 'Netflix Premium',
          'category': 'SUBSCRIPTION',
          'amount': 186000,
          'billingCycle': 'MONTHLY',
          'nextDueDate': '2026-05-01T00:00:00.000Z',
          'reminderDaysBefore': [7, 3, 1],
          'status': 'ACTIVE',
          'attachments': [],
        };

        return http.Response(jsonEncode(responseBody), 200);
      });

      final apiClient = ApiClient(
        baseUrl: 'http://localhost:3000',
        client: mockHttpClient,
      );

      final itemsRepo = ItemsRepository(apiClient);
      final renewed = await itemsRepo.renewItem('item-101');

      expect(renewed.id, 'item-101');
      expect(renewed.nextDueDate.month, 5);
    });

    test('AnalyticsRepository fetches and parses analytics summary', () async {
      final mockHttpClient = MockClient((request) async {
        expect(request.url.path, '/analytics/summary');

        final responseBody = {
          'estMonthlySpend': 240990,
          'annualizedSpend': 2891880,
          'dueThisMonth': 240990,
          'upcoming90DaysSpikes': [
            {
              'month': 'May 2026',
              'amount': 3500000,
              'diffFromAverage': 3259010,
              'reasons': ['STNK Renewal'],
            }
          ],
          'categoryBreakdown': {
            'subscriptionPercentage': 75,
            'warrantyPercentage': 0,
            'billIdPercentage': 25,
          },
        };

        return http.Response(jsonEncode(responseBody), 200);
      });

      final apiClient = ApiClient(
        baseUrl: 'http://localhost:3000',
        client: mockHttpClient,
      );

      final analyticsRepo = AnalyticsRepository(apiClient);
      final summary = await analyticsRepo.getSummary();

      expect(summary.estMonthlySpend, 240990);
      expect(summary.upcoming90DaysSpikes.first.month, 'May 2026');
      expect(summary.categoryBreakdown.subscriptionPercentage, 75);
    });
  });
}
