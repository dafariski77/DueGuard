import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:dueguard/core/network/api_client.dart';
import 'package:dueguard/data/repositories/auth_repository.dart';

void main() {
  group('AuthRepository (JWT Authentication & Backend Integration)', () {
    test('authenticates via login and sets apiClient.authToken', () async {
      final mockHttpClient = MockClient((request) async {
        if (request.url.path == '/auth/login') {
          return http.Response(
            jsonEncode({'accessToken': 'jwt_token_login_123'}),
            200,
            headers: {'content-type': 'application/json'},
          );
        }
        return http.Response('Not found', 404);
      });

      final apiClient = ApiClient(baseUrl: 'http://localhost:3000', client: mockHttpClient);
      final authRepo = AuthRepository(apiClient);

      final token = await authRepo.authenticate();
      expect(token, 'jwt_token_login_123');
      expect(apiClient.authToken, 'jwt_token_login_123');
    });

    test('falls back to register if user does not exist yet', () async {
      final mockHttpClient = MockClient((request) async {
        if (request.url.path == '/auth/login') {
          return http.Response('Unauthorized', 401);
        }
        if (request.url.path == '/auth/register') {
          return http.Response(
            jsonEncode({'accessToken': 'jwt_token_registered_456'}),
            201,
            headers: {'content-type': 'application/json'},
          );
        }
        return http.Response('Not found', 404);
      });

      final apiClient = ApiClient(baseUrl: 'http://localhost:3000', client: mockHttpClient);
      final authRepo = AuthRepository(apiClient);

      final token = await authRepo.authenticate();
      expect(token, 'jwt_token_registered_456');
      expect(apiClient.authToken, 'jwt_token_registered_456');
    });

    test('deletes user account and clears token', () async {
      bool deleted = false;
      final mockHttpClient = MockClient((request) async {
        if (request.url.path == '/users/me' && request.method == 'DELETE') {
          deleted = true;
          return http.Response('', 204);
        }
        return http.Response('Not found', 404);
      });

      final apiClient = ApiClient(
        baseUrl: 'http://localhost:3000',
        client: mockHttpClient,
        authToken: 'active_token',
      );
      final authRepo = AuthRepository(apiClient);

      await authRepo.deleteAccount();
      expect(deleted, isTrue);
      expect(apiClient.authToken, isNull);
    });
  });
}
