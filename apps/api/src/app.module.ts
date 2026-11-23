import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { ItemsModule } from './items/items.module.js';
import { AnalyticsModule } from './analytics/analytics.module.js';
import { AttachmentsModule } from './attachments/attachments.module.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    ItemsModule,
    AnalyticsModule,
    AttachmentsModule,
  ],
})
export class AppModule {}

