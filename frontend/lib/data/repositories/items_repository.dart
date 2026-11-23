import '../../core/network/api_client.dart';
import '../models/enums.dart';
import '../models/tracked_item.dart';

class ItemsRepository {
  final ApiClient apiClient;

  const ItemsRepository(this.apiClient);

  Future<List<TrackedItem>> getItems({Category? category, ItemStatus? status}) async {
    final queryParams = <String, dynamic>{};
    if (category != null) queryParams['category'] = category.toBackendString();
    if (status != null) queryParams['status'] = status.toBackendString();

    final data = await apiClient.get('/items', queryParameters: queryParams.isEmpty ? null : queryParams);
    if (data is List) {
      return data.map((json) => TrackedItem.fromJson(json as Map<String, dynamic>)).toList();
    }
    return [];
  }

  Future<TrackedItem> getItemById(String id) async {
    final data = await apiClient.get('/items/$id');
    return TrackedItem.fromJson(data as Map<String, dynamic>);
  }

  Future<TrackedItem> createItem(TrackedItem item) async {
    final data = await apiClient.post('/items', body: item.toJson());
    return TrackedItem.fromJson(data as Map<String, dynamic>);
  }

  Future<TrackedItem> updateItem(String id, Map<String, dynamic> patchData) async {
    final data = await apiClient.patch('/items/$id', body: patchData);
    return TrackedItem.fromJson(data as Map<String, dynamic>);
  }

  Future<void> deleteItem(String id) async {
    await apiClient.delete('/items/$id');
  }

  Future<TrackedItem> renewItem(String id) async {
    final data = await apiClient.post('/items/$id/renew');
    return TrackedItem.fromJson(data as Map<String, dynamic>);
  }
}
