import '../../core/network/api_client_interface.dart';
import '../models/analytics_summary.dart';
import 'analytics_repository_interface.dart';

class AnalyticsRepository implements IAnalyticsRepository {
  final IApiClient apiClient;

  const AnalyticsRepository(this.apiClient);

  @override
  Future<AnalyticsSummary> getSummary() async {
    final data = await apiClient.get('/analytics/summary');
    return AnalyticsSummary.fromJson(data as Map<String, dynamic>);
  }
}
