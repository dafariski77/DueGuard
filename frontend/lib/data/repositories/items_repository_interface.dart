import '../models/enums.dart';
import '../models/tracked_item.dart';

abstract class IItemsRepository {
  Future<List<TrackedItem>> getItems({Category? category, ItemStatus? status});
  Future<TrackedItem> getItemById(String id);
  Future<TrackedItem> createItem(TrackedItem item);
  Future<TrackedItem> updateItem(String id, Map<String, dynamic> patchData);
  Future<void> deleteItem(String id);
  Future<TrackedItem> renewItem(String id);
}
