import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';
import { NotificationsController } from './notifications.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { TierPolicyService } from '../common/tier-policy.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, TierPolicyService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
