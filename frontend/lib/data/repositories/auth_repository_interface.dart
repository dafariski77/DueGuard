abstract class IAuthRepository {
  Future<String> authenticate({String email, String password});
  Future<void> deleteAccount();
}
