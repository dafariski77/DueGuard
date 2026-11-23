import '../../core/network/api_client.dart';
import 'auth_repository_interface.dart';

class AuthRepository implements IAuthRepository {
  final ApiClient apiClient;

  AuthRepository(this.apiClient);

  @override
  Future<String> authenticate({
    String email = 'demo@dueguard.com',
    String password = 'Password123!',
  }) async {
    try {
      final loginRes = await apiClient.post('/auth/login', body: {
        'email': email,
        'password': password,
      });

      if (loginRes != null && loginRes['accessToken'] != null) {
        final token = loginRes['accessToken'] as String;
        apiClient.authToken = token;
        return token;
      }
    } catch (_) {
      // If login fails (user does not exist yet), register user automatically
    }

    final regRes = await apiClient.post('/auth/register', body: {
      'email': email,
      'password': password,
      'currencyCode': 'IDR',
    });

    if (regRes != null && regRes['accessToken'] != null) {
      final token = regRes['accessToken'] as String;
      apiClient.authToken = token;
      return token;
    }

    throw Exception('Failed to authenticate with DueGuard backend API');
  }

  @override
  Future<void> deleteAccount() async {
    await apiClient.delete('/users/me');
    apiClient.authToken = null;
  }
}
