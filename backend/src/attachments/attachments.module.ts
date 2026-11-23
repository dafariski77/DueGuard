import { Module } from '@nestjs/common';
import { AttachmentsService } from './attachments.service.js';
import { AttachmentsController } from './attachments.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { TierPolicyService } from '../common/tier-policy.service.js';
import { MockStorageService } from './mock-storage.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [AttachmentsController],
  providers: [AttachmentsService, TierPolicyService, MockStorageService],
  exports: [AttachmentsService],
})
export class AttachmentsModule {}
