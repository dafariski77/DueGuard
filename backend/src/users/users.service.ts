import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        currencyCode: true,
        timezone: true,
        isPro: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updatePushToken(userId: string, expoPushToken: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { expoPushToken },
    });
  }

  async deleteAccount(userId: string) {
    // Cascades dependent TrackedItems, Attachments, and NotificationLogs via Prisma schema onDelete: Cascade
    await this.prisma.user.delete({
      where: { id: userId },
    });
    return { success: true, message: 'Account and associated encrypted vault data successfully erased' };
  }
}
