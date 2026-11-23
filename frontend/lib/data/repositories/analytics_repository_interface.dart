import '../models/analytics_summary.dart';

abstract class IAnalyticsRepository {
  Future<AnalyticsSummary> getSummary();
}
