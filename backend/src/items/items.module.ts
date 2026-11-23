import { Module } from '@nestjs/common';
import { ItemsService } from './items.service.js';
import { ItemsController } from './items.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { TierPolicyService } from '../common/tier-policy.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [ItemsController],
  providers: [ItemsService, TierPolicyService],
  exports: [ItemsService, TierPolicyService],
})
export class ItemsModule {}
