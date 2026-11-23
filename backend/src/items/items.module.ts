import { Module } from '@nestjs/common';
import { ItemsService } from './items.service.js';
import { ItemsController } from './items.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService],
})
export class ItemsModule {}
