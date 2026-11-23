import { BillingCycle } from '../common/index.js';

export interface IRenewalStrategy {
  calculateNextDueDate(currentDueDate: Date): Date;
}

/**
 * Returns the maximum days in the given year and month (1-based month).
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/**
 * Monthly renewal strategy with day-of-month clamping.
 * Ensures Jan 31st advances to Feb 28/29 rather than overflowing to March.
 */
export class MonthlyRenewalStrategy implements IRenewalStrategy {
  calculateNextDueDate(currentDueDate: Date): Date {
    const current = new Date(currentDueDate);
    const day = current.getUTCDate();
    const currentMonth = current.getUTCMonth(); // 0-based
    const currentYear = current.getUTCFullYear();

    let targetYear = currentYear;
    let targetMonth = currentMonth + 1; // 0-based next month

    if (targetMonth > 11) {
      targetYear += 1;
      targetMonth = 0;
    }

    const maxDays = getDaysInMonth(targetYear, targetMonth + 1);
    const clampedDay = Math.min(day, maxDays);

    return new Date(
      Date.UTC(
        targetYear,
        targetMonth,
        clampedDay,
        current.getUTCHours(),
        current.getUTCMinutes(),
        current.getUTCSeconds(),
        current.getUTCMilliseconds()
      )
    );
  }
}

/**
 * Quarterly renewal strategy with day-of-month clamping.
 */
export class QuarterlyRenewalStrategy implements IRenewalStrategy {
  calculateNextDueDate(currentDueDate: Date): Date {
    const current = new Date(currentDueDate);
    const day = current.getUTCDate();
    const currentMonth = current.getUTCMonth();
    const currentYear = current.getUTCFullYear();

    let targetMonth = currentMonth + 3;
    let targetYear = currentYear;

    if (targetMonth > 11) {
      targetYear += Math.floor(targetMonth / 12);
      targetMonth = targetMonth % 12;
    }

    const maxDays = getDaysInMonth(targetYear, targetMonth + 1);
    const clampedDay = Math.min(day, maxDays);

    return new Date(
      Date.UTC(
        targetYear,
        targetMonth,
        clampedDay,
        current.getUTCHours(),
        current.getUTCMinutes(),
        current.getUTCSeconds(),
        current.getUTCMilliseconds()
      )
    );
  }
}

/**
 * Yearly renewal strategy with leap-year day clamping (Feb 29 -> Feb 28 on non-leap years).
 */
export class YearlyRenewalStrategy implements IRenewalStrategy {
  calculateNextDueDate(currentDueDate: Date): Date {
    const current = new Date(currentDueDate);
    const day = current.getUTCDate();
    const targetMonth = current.getUTCMonth();
    const targetYear = current.getUTCFullYear() + 1;

    const maxDays = getDaysInMonth(targetYear, targetMonth + 1);
    const clampedDay = Math.min(day, maxDays);

    return new Date(
      Date.UTC(
        targetYear,
        targetMonth,
        clampedDay,
        current.getUTCHours(),
        current.getUTCMinutes(),
        current.getUTCSeconds(),
        current.getUTCMilliseconds()
      )
    );
  }
}

/**
 * One-time cycle does not roll forward.
 */
export class OneTimeRenewalStrategy implements IRenewalStrategy {
  calculateNextDueDate(currentDueDate: Date): Date {
    return new Date(currentDueDate);
  }
}

export class RenewalCalculator {
  private static readonly strategies: Record<BillingCycle, IRenewalStrategy> = {
    [BillingCycle.MONTHLY]: new MonthlyRenewalStrategy(),
    [BillingCycle.QUARTERLY]: new QuarterlyRenewalStrategy(),
    [BillingCycle.YEARLY]: new YearlyRenewalStrategy(),
    [BillingCycle.ONE_TIME]: new OneTimeRenewalStrategy(),
  };

  static getStrategy(cycle: BillingCycle): IRenewalStrategy {
    return this.strategies[cycle] || this.strategies[BillingCycle.MONTHLY];
  }

  static calculateNextDueDate(cycle: BillingCycle, currentDueDate: Date): Date {
    return this.getStrategy(cycle).calculateNextDueDate(currentDueDate);
  }
}
