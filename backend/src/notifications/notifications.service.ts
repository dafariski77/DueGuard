import { Injectable, Optional } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ItemStatus } from '../common/index.js';
import { TierPolicyService } from '../common/tier-policy.service.js';
import { NotificationFormatter } from './notification-formatter.js';

export interface PushClient {
  send(message: {
    to: string;
    title: string;
    body: string;
    data?: any;
    sound?: string;
    priority?: string;
  }): Promise<any>;
}

@Injectable()
export class NotificationsService {
  private pushClient: PushClient;

  constructor(
    private readonly prisma: PrismaService,
    @Optional() pushClient?: PushClient,
    private readonly tierPolicy: TierPolicyService = new TierPolicyService()
  ) {
    this.pushClient = pushClient || {
      send: async (msg) => {
        try {
          const res = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(msg),
          });
          return res.json();
        } catch (err) {
          return { status: 'error', error: err };
        }
      },
    };
  }

  async processDailyReminders(referenceDate: Date = new Date()) {
    const today = new Date(referenceDate);
    today.setUTCHours(0, 0, 0, 0);

    const activeItems = await this.prisma.trackedItem.findMany({
      where: {
        status: ItemStatus.ACTIVE,
      },
      include: {
        user: true,
      },
    });

    let sentCount = 0;
    let skippedCount = 0;

    for (const item of activeItems) {
      if (!item.user?.expoPushToken) continue;

      const dueDate = new Date(item.nextDueDate);
      dueDate.setUTCHours(0, 0, 0, 0);

      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) continue;

      const stages = item.reminderDaysBefore || [7, 1];
      if (!stages.includes(diffDays)) continue;

      if (!this.tierPolicy.isNotificationStageAllowed(diffDays, item.user.isPro)) {
        continue;
      }

      const existing = await this.prisma.notificationLog.findFirst({
        where: {
          itemId: item.id,
          daysBefore: diffDays,
          scheduledFor: today,
        },
      });

      if (existing) {
        skippedCount++;
        continue;
      }

      const title = NotificationFormatter.formatTitle(item.title, diffDays);
      const body = NotificationFormatter.formatBody(item.amount != null ? Number(item.amount) : null);

      try {
        await this.pushClient.send({
          to: item.user.expoPushToken,
          title,
          body,
          sound: 'default',
          priority: diffDays <= 3 ? 'high' : 'normal',
          data: { itemId: item.id },
        });

        await this.prisma.notificationLog.create({
          data: {
            itemId: item.id,
            daysBefore: diffDays,
            scheduledFor: today,
            sentAt: new Date(),
            status: 'SENT',
          },
        });

        sentCount++;
      } catch {
        await this.prisma.notificationLog.create({
          data: {
            itemId: item.id,
            daysBefore: diffDays,
            scheduledFor: today,
            sentAt: new Date(),
            status: 'FAILED',
          },
        });
      }
    }

    return { sentCount, skippedCount };
  }
}
