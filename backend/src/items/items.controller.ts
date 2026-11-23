import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ItemsService } from './items.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import {
  CreateTrackedItemSchema,
  UpdateTrackedItemSchema,
  Category,
  ItemStatus,
} from '../common/index.js';

@Controller('items')
@UseGuards(JwtAuthGuard)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  async create(@CurrentUser() user: any, @Body() body: any) {
    const parseResult = CreateTrackedItemSchema.safeParse(body);
    if (!parseResult.success) {
      throw new BadRequestException(parseResult.error.format());
    }
    return this.itemsService.create(user.sub, parseResult.data);
  }

  @Get()
  async findAll(
    @CurrentUser() user: any,
    @Query('category') category?: Category,
    @Query('status') status?: ItemStatus
  ) {
    return this.itemsService.findAll(user.sub, { category, status });
  }

  @Get(':id')
  async findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.itemsService.findOne(user.sub, id);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() body: any
  ) {
    const parseResult = UpdateTrackedItemSchema.safeParse(body);
    if (!parseResult.success) {
      throw new BadRequestException(parseResult.error.format());
    }
    return this.itemsService.update(user.sub, id, parseResult.data);
  }

  @Post(':id/renew')
  async renew(@CurrentUser() user: any, @Param('id') id: string) {
    return this.itemsService.renew(user.sub, id);
  }

  @Delete(':id')
  async delete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.itemsService.delete(user.sub, id);
  }
}
