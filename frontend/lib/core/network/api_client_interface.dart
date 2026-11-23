abstract class IApiClient {
  Future<dynamic> get(String path, {Map<String, dynamic>? queryParameters});
  Future<dynamic> post(String path, {dynamic body});
  Future<dynamic> patch(String path, {dynamic body});
  Future<dynamic> delete(String path);
}
