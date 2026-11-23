import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  AttachmentsService,
  PresignUploadDto,
  ConfirmUploadDto,
} from './attachments.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller('items/:itemId/attachments')
@UseGuards(JwtAuthGuard)
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post('presign-upload')
  async presignUpload(
    @CurrentUser() user: any,
    @Param('itemId') itemId: string,
    @Body() body: PresignUploadDto
  ) {
    return this.attachmentsService.getPresignedUploadUrl(user.sub, itemId, body);
  }

  @Post('confirm')
  async confirmUpload(
    @CurrentUser() user: any,
    @Param('itemId') itemId: string,
    @Body() body: ConfirmUploadDto
  ) {
    return this.attachmentsService.confirmUpload(user.sub, itemId, body);
  }

  @Get(':attachmentId/presign-view')
  async presignView(
    @CurrentUser() user: any,
    @Param('itemId') itemId: string,
    @Param('attachmentId') attachmentId: string
  ) {
    return this.attachmentsService.getPresignedViewUrl(
      user.sub,
      itemId,
      attachmentId
    );
  }

  @Delete(':attachmentId')
  async delete(
    @CurrentUser() user: any,
    @Param('itemId') itemId: string,
    @Param('attachmentId') attachmentId: string
  ) {
    return this.attachmentsService.delete(user.sub, itemId, attachmentId);
  }
}
