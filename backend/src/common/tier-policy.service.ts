import { Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class TierPolicyService {
  static readonly FREE_TIER_MAX_ITEMS = 7;
  static readonly FREE_TIER_MAX_ATTACHMENTS = 2;
  static readonly FREE_TIER_MAX_NOTIFICATION_DAYS = 3;

  assertCanCreateItem(activeCount: number, isPro: boolean): void {
    if (!isPro && activeCount >= TierPolicyService.FREE_TIER_MAX_ITEMS) {
      throw new ForbiddenException(
        `Free tier limit reached (max ${TierPolicyService.FREE_TIER_MAX_ITEMS} active items). Upgrade to Pro for unlimited items.`
      );
    }
  }

  assertCanAddAttachment(currentCount: number, isPro: boolean): void {
    if (!isPro && currentCount >= TierPolicyService.FREE_TIER_MAX_ATTACHMENTS) {
      throw new ForbiddenException(
        `Free tier limit reached (max ${TierPolicyService.FREE_TIER_MAX_ATTACHMENTS} attachments per item). Upgrade to Pro for unlimited attachments.`
      );
    }
  }

  isNotificationStageAllowed(daysBefore: number, isPro: boolean): boolean {
    if (isPro) return true;
    return daysBefore <= TierPolicyService.FREE_TIER_MAX_NOTIFICATION_DAYS;
  }

  getMaxItems(isPro: boolean): number {
    return isPro ? Number.POSITIVE_INFINITY : TierPolicyService.FREE_TIER_MAX_ITEMS;
  }

  getMaxAttachments(isPro: boolean): number {
    return isPro ? Number.POSITIVE_INFINITY : TierPolicyService.FREE_TIER_MAX_ATTACHMENTS;
  }
}
