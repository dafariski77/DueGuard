import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  BillingCycle,
  Category,
  ItemStatus,
  CreateTrackedItemDto,
  UpdateTrackedItemDto,
} from '../common/index.js';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateTrackedItemDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const isPro = user?.isPro ?? false;

    if (!isPro) {
      const activeCount = await this.prisma.trackedItem.count({
        where: { userId, status: ItemStatus.ACTIVE },
      });
      if (activeCount >= 7) {
        throw new ForbiddenException(
          'Free tier limit reached (max 7 active items). Upgrade to Pro for unlimited items.'
        );
      }
    }

    return this.prisma.trackedItem.create({
      data: {
        userId,
        title: dto.title,
        category: dto.category as any,
        templateKey: dto.templateKey,
        amount: dto.amount != null ? dto.amount : null,
        billingCycle: (dto.billingCycle || BillingCycle.MONTHLY) as any,
        nextDueDate: new Date(dto.nextDueDate),
        reminderDaysBefore: dto.reminderDaysBefore || [7, 1],
        notes: dto.notes,
        cancelUrl: dto.cancelUrl,
        status: ItemStatus.ACTIVE as any,
      },
    });
  }

  async findAll(
    userId: string,
    filters?: { category?: Category; status?: ItemStatus }
  ) {
    const where: any = { userId };
    if (filters?.category) {
      where.category = filters.category;
    }
    if (filters?.status) {
      where.status = filters.status;
    } else {
      where.status = ItemStatus.ACTIVE;
    }

    return this.prisma.trackedItem.findMany({
      where,
      orderBy: { nextDueDate: 'asc' },
    });
  }

  async findOne(userId: string, id: string) {
    const item = await this.prisma.trackedItem.findFirst({
      where: { id, userId },
    });
    if (!item) {
      throw new NotFoundException(`Tracked item with ID ${id} not found`);
    }
    return item;
  }

  async update(userId: string, id: string, dto: UpdateTrackedItemDto) {
    await this.findOne(userId, id);

    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.category !== undefined) data.category = dto.category;
    if (dto.templateKey !== undefined) data.templateKey = dto.templateKey;
    if (dto.amount !== undefined) data.amount = dto.amount;
    if (dto.billingCycle !== undefined) data.billingCycle = dto.billingCycle;
    if (dto.nextDueDate !== undefined) data.nextDueDate = new Date(dto.nextDueDate);
    if (dto.reminderDaysBefore !== undefined) data.reminderDaysBefore = dto.reminderDaysBefore;
    if (dto.notes !== undefined) data.notes = dto.notes;
    if (dto.cancelUrl !== undefined) data.cancelUrl = dto.cancelUrl;
    if (dto.status !== undefined) data.status = dto.status;

    return this.prisma.trackedItem.update({
      where: { id },
      data,
    });
  }

  async renew(userId: string, id: string) {
    const item = await this.findOne(userId, id);

    if (item.billingCycle === BillingCycle.ONE_TIME) {
      return this.prisma.trackedItem.update({
        where: { id },
        data: { status: ItemStatus.ARCHIVED as any },
      });
    }

    const currentDue = new Date(item.nextDueDate);
    const nextDue = new Date(currentDue);

    if (item.billingCycle === BillingCycle.MONTHLY) {
      nextDue.setMonth(nextDue.getMonth() + 1);
    } else if (item.billingCycle === BillingCycle.QUARTERLY) {
      nextDue.setMonth(nextDue.getMonth() + 3);
    } else if (item.billingCycle === BillingCycle.YEARLY) {
      nextDue.setFullYear(nextDue.getFullYear() + 1);
    }

    return this.prisma.trackedItem.update({
      where: { id },
      data: { nextDueDate: nextDue },
    });
  }

  async delete(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.trackedItem.delete({
      where: { id },
    });
  }
}
