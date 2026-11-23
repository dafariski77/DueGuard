import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service.js';
import { ISocialAuthVerifier } from './social-verifier.interface.js';
import { SocialAuthVerifierService } from './social-verifier.service.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dueguard_default_dev_secret_key_change_in_prod';
const JWT_EXPIRES_IN = '30d';

export interface JwtPayload {
  sub: string;
  email: string;
  isPro: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly socialVerifier: ISocialAuthVerifier = new SocialAuthVerifierService()
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateToken(user: { id: string; email: string; isPro: boolean }): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      isPro: user.isPro,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
      throw new UnauthorizedException('Invalid or expired authentication token');
    }
  }

  async register(email: string, password: string, currencyCode = 'IDR') {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Email is already registered');
    }
    const passwordHash = await this.hashPassword(password);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        authProvider: 'email',
        currencyCode,
      },
    });

    const accessToken = this.generateToken(user);
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        currencyCode: user.currencyCode,
        isPro: user.isPro,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isMatch = await this.verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = this.generateToken(user);
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        currencyCode: user.currencyCode,
        isPro: user.isPro,
      },
    };
  }

  async verifySocialToken(provider: 'google' | 'apple', idToken: string) {
    const verified = await this.socialVerifier.verifyToken(provider, idToken);

    let user = await this.prisma.user.findUnique({ where: { email: verified.email } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: verified.email,
          authProvider: provider,
        },
      });
    }

    const accessToken = this.generateToken(user);
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        currencyCode: user.currencyCode,
        isPro: user.isPro,
      },
    };
  }
}
