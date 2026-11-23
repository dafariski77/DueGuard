import 'package:flutter/foundation.dart';

class ApiConfig {
  static const String _defaultUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://127.0.0.1:3000',
  );

  static String get baseUrl {
    if (kIsWeb) return _defaultUrl;
    if (defaultTargetPlatform == TargetPlatform.android) {
      return 'http://10.0.2.2:3000';
    }
    return _defaultUrl;
  }
}
