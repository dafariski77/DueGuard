import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  Category,
  BillingCycle,
  ItemStatus,
  AnalyticsSummaryDto,
} from '../common/index.js';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(
    userId: string,
    referenceDate: Date = new Date()
  ): Promise<AnalyticsSummaryDto> {
    const items = await this.prisma.trackedItem.findMany({
      where: { userId, status: ItemStatus.ACTIVE },
    });

    let estMonthlySpend = 0;
    let subSpend = 0;
    let warSpend = 0;
    let billSpend = 0;

    const refYear = referenceDate.getUTCFullYear();
    const refMonth = referenceDate.getUTCMonth();

    let dueThisMonth = 0;

    for (const item of items) {
      const amt = item.amount ? Number(item.amount) : 0;
      let monthlyContribution = 0;

      if (item.billingCycle === BillingCycle.MONTHLY) {
        monthlyContribution = amt;
      } else if (item.billingCycle === BillingCycle.QUARTERLY) {
        monthlyContribution = amt / 3;
      } else if (item.billingCycle === BillingCycle.YEARLY) {
        monthlyContribution = amt / 12;
      }

      estMonthlySpend += monthlyContribution;

      if (item.category === Category.SUBSCRIPTION) subSpend += monthlyContribution;
      else if (item.category === Category.WARRANTY) warSpend += monthlyContribution;
      else if (item.category === Category.BILL_ID) billSpend += monthlyContribution;

      const dueDate = new Date(item.nextDueDate);
      if (
        dueDate.getUTCFullYear() === refYear &&
        dueDate.getUTCMonth() === refMonth
      ) {
        dueThisMonth += amt;
      }
    }

    const annualizedSpend = Math.round(estMonthlySpend * 12);
    estMonthlySpend = Math.round(estMonthlySpend);
    dueThisMonth = Math.round(dueThisMonth);

    let subscriptionPercentage = 0;
    let warrantyPercentage = 0;
    let billIdPercentage = 0;

    const totalCategorySpend = subSpend + warSpend + billSpend;
    if (totalCategorySpend > 0) {
      subscriptionPercentage = Math.round((subSpend / totalCategorySpend) * 100);
      warrantyPercentage = Math.round((warSpend / totalCategorySpend) * 100);
      billIdPercentage = 100 - subscriptionPercentage - warrantyPercentage;
    }

    const upcoming90DaysSpikes: AnalyticsSummaryDto['upcoming90DaysSpikes'] = [];
    for (let i = 1; i <= 3; i++) {
      const projDate = new Date(Date.UTC(refYear, refMonth + i, 1));
      const pYear = projDate.getUTCFullYear();
      const pMonth = projDate.getUTCMonth();
      const monthStr = `${pYear}-${String(pMonth + 1).padStart(2, '0')}`;

      let monthTotal = 0;
      const reasons: string[] = [];

      for (const item of items) {
        const amt = item.amount ? Number(item.amount) : 0;
        const dueDate = new Date(item.nextDueDate);

        let willBeDue = false;
        if (item.billingCycle === BillingCycle.MONTHLY) {
          willBeDue = true;
        } else if (
          dueDate.getUTCFullYear() === pYear &&
          dueDate.getUTCMonth() === pMonth
        ) {
          willBeDue = true;
        }

        if (willBeDue) {
          monthTotal += amt;
          if (amt >= 500000 || item.billingCycle === BillingCycle.YEARLY) {
            reasons.push(`${item.title} (Rp ${amt.toLocaleString('id-ID')})`);
          }
        }
      }

      const diffFromAverage = monthTotal - estMonthlySpend;
      upcoming90DaysSpikes.push({
        month: monthStr,
        amount: Math.round(monthTotal),
        diffFromAverage: Math.round(diffFromAverage),
        reasons,
      });
    }

    return {
      estMonthlySpend,
      annualizedSpend,
      dueThisMonth,
      upcoming90DaysSpikes,
      categoryBreakdown: {
        subscriptionPercentage,
        warrantyPercentage,
        billIdPercentage,
      },
    };
  }
}
