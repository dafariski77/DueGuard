export interface SocialVerifiedUser {
  email: string;
  sub: string;
  provider: 'google' | 'apple';
}

export interface ISocialAuthVerifier {
  verifyToken(provider: 'google' | 'apple', idToken: string): Promise<SocialVerifiedUser>;
}
