import { Controller, Post, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('trigger-sweep')
  @UseGuards(JwtAuthGuard)
  async triggerSweep() {
    return this.notificationsService.processDailyReminders();
  }
}
