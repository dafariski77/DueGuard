import '../../core/network/api_client.dart';
import '../models/analytics_summary.dart';

class AnalyticsRepository {
  final ApiClient apiClient;

  const AnalyticsRepository(this.apiClient);

  Future<AnalyticsSummary> getSummary() async {
    final data = await apiClient.get('/analytics/summary');
    return AnalyticsSummary.fromJson(data as Map<String, dynamic>);
  }
}
