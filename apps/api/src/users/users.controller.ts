import { Controller, Get, Delete, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser() user: { sub: string }) {
    return this.usersService.findById(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('push-token')
  async updatePushToken(
    @CurrentUser() user: { sub: string },
    @Body('token') token: string,
  ) {
    return this.usersService.updatePushToken(user.sub, token);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteAccount(@CurrentUser() user: { sub: string }) {
    return this.usersService.deleteAccount(user.sub);
  }
}
