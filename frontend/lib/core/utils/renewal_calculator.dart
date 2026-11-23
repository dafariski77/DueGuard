import '../../data/models/enums.dart';

abstract class RenewalStrategy {
  DateTime calculateNextDueDate(DateTime currentDueDate);
}

int getDaysInMonth(int year, int month) {
  // DateTime(year, month + 1, 0) gives the last day of `month`
  return DateTime(year, month + 1, 0).day;
}

class MonthlyRenewalStrategy implements RenewalStrategy {
  @override
  DateTime calculateNextDueDate(DateTime currentDueDate) {
    int targetYear = currentDueDate.year;
    int targetMonth = currentDueDate.month + 1;

    if (targetMonth > 12) {
      targetYear += 1;
      targetMonth = 1;
    }

    final maxDays = getDaysInMonth(targetYear, targetMonth);
    final clampedDay = currentDueDate.day > maxDays ? maxDays : currentDueDate.day;

    return DateTime(
      targetYear,
      targetMonth,
      clampedDay,
      currentDueDate.hour,
      currentDueDate.minute,
      currentDueDate.second,
    );
  }
}

class QuarterlyRenewalStrategy implements RenewalStrategy {
  @override
  DateTime calculateNextDueDate(DateTime currentDueDate) {
    int targetYear = currentDueDate.year;
    int targetMonth = currentDueDate.month + 3;

    if (targetMonth > 12) {
      targetYear += (targetMonth - 1) ~/ 12;
      targetMonth = ((targetMonth - 1) % 12) + 1;
    }

    final maxDays = getDaysInMonth(targetYear, targetMonth);
    final clampedDay = currentDueDate.day > maxDays ? maxDays : currentDueDate.day;

    return DateTime(
      targetYear,
      targetMonth,
      clampedDay,
      currentDueDate.hour,
      currentDueDate.minute,
      currentDueDate.second,
    );
  }
}

class YearlyRenewalStrategy implements RenewalStrategy {
  @override
  DateTime calculateNextDueDate(DateTime currentDueDate) {
    final targetYear = currentDueDate.year + 1;
    final targetMonth = currentDueDate.month;

    final maxDays = getDaysInMonth(targetYear, targetMonth);
    final clampedDay = currentDueDate.day > maxDays ? maxDays : currentDueDate.day;

    return DateTime(
      targetYear,
      targetMonth,
      clampedDay,
      currentDueDate.hour,
      currentDueDate.minute,
      currentDueDate.second,
    );
  }
}

class OneTimeRenewalStrategy implements RenewalStrategy {
  @override
  DateTime calculateNextDueDate(DateTime currentDueDate) {
    return currentDueDate;
  }
}

class RenewalCalculator {
  static final Map<BillingCycle, RenewalStrategy> _strategies = {
    BillingCycle.monthly: MonthlyRenewalStrategy(),
    BillingCycle.quarterly: QuarterlyRenewalStrategy(),
    BillingCycle.yearly: YearlyRenewalStrategy(),
    BillingCycle.oneTime: OneTimeRenewalStrategy(),
  };

  static RenewalStrategy getStrategy(BillingCycle cycle) {
    return _strategies[cycle] ?? _strategies[BillingCycle.monthly]!;
  }

  static DateTime calculateNextDueDate(BillingCycle cycle, DateTime currentDueDate) {
    return getStrategy(cycle).calculateNextDueDate(currentDueDate);
  }
}
