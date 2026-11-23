enum Category {
  subscription,
  warranty,
  billId;

  String toBackendString() {
    switch (this) {
      case Category.subscription:
        return 'SUBSCRIPTION';
      case Category.warranty:
        return 'WARRANTY';
      case Category.billId:
        return 'BILL_ID';
    }
  }

  static Category fromBackendString(String val) {
    switch (val.toUpperCase()) {
      case 'SUBSCRIPTION':
        return Category.subscription;
      case 'WARRANTY':
        return Category.warranty;
      case 'BILL_ID':
      default:
        return Category.billId;
    }
  }

  String get displayName {
    switch (this) {
      case Category.subscription:
        return 'Subscriptions';
      case Category.warranty:
        return 'Warranties';
      case Category.billId:
        return 'Bills & IDs';
    }
  }
}

enum BillingCycle {
  oneTime,
  monthly,
  quarterly,
  yearly;

  String toBackendString() {
    switch (this) {
      case BillingCycle.oneTime:
        return 'ONE_TIME';
      case BillingCycle.monthly:
        return 'MONTHLY';
      case BillingCycle.quarterly:
        return 'QUARTERLY';
      case BillingCycle.yearly:
        return 'YEARLY';
    }
  }

  static BillingCycle fromBackendString(String val) {
    switch (val.toUpperCase()) {
      case 'ONE_TIME':
        return BillingCycle.oneTime;
      case 'MONTHLY':
        return BillingCycle.monthly;
      case 'QUARTERLY':
        return BillingCycle.quarterly;
      case 'YEARLY':
      default:
        return BillingCycle.yearly;
    }
  }

  String get displayName {
    switch (this) {
      case BillingCycle.oneTime:
        return 'One-Time';
      case BillingCycle.monthly:
        return 'Monthly';
      case BillingCycle.quarterly:
        return 'Quarterly';
      case BillingCycle.yearly:
        return 'Yearly';
    }
  }
}

enum ItemStatus {
  active,
  archived;

  String toBackendString() => name.toUpperCase();

  static ItemStatus fromBackendString(String val) =>
      val.toUpperCase() == 'ARCHIVED' ? ItemStatus.archived : ItemStatus.active;
}
