class CashSpike {
  final String month;
  final double amount;
  final double diffFromAverage;
  final List<String> reasons;

  const CashSpike({
    required this.month,
    required this.amount,
    required this.diffFromAverage,
    this.reasons = const [],
  });

  bool get isSpike => diffFromAverage > 0 && reasons.isNotEmpty;

  factory CashSpike.fromJson(Map<String, dynamic> json) {
    final rawReasons = json['reasons'];
    List<String> r = [];
    if (rawReasons is List) {
      r = rawReasons.map((e) => e.toString()).toList();
    }

    return CashSpike(
      month: json['month'] as String? ?? '',
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      diffFromAverage: (json['diffFromAverage'] as num?)?.toDouble() ?? 0.0,
      reasons: r,
    );
  }

  Map<String, dynamic> toJson() => {
        'month': month,
        'amount': amount,
        'diffFromAverage': diffFromAverage,
        'reasons': reasons,
      };
}

class CategoryBreakdown {
  final int subscriptionPercentage;
  final int warrantyPercentage;
  final int billIdPercentage;

  const CategoryBreakdown({
    this.subscriptionPercentage = 0,
    this.warrantyPercentage = 0,
    this.billIdPercentage = 0,
  });

  factory CategoryBreakdown.fromJson(Map<String, dynamic> json) {
    return CategoryBreakdown(
      subscriptionPercentage: (json['subscriptionPercentage'] as num?)?.toInt() ?? 0,
      warrantyPercentage: (json['warrantyPercentage'] as num?)?.toInt() ?? 0,
      billIdPercentage: (json['billIdPercentage'] as num?)?.toInt() ?? 0,
    );
  }

  Map<String, dynamic> toJson() => {
        'subscriptionPercentage': subscriptionPercentage,
        'warrantyPercentage': warrantyPercentage,
        'billIdPercentage': billIdPercentage,
      };
}

class AnalyticsSummary {
  final double estMonthlySpend;
  final double annualizedSpend;
  final double dueThisMonth;
  final List<CashSpike> upcoming90DaysSpikes;
  final CategoryBreakdown categoryBreakdown;

  const AnalyticsSummary({
    required this.estMonthlySpend,
    required this.annualizedSpend,
    required this.dueThisMonth,
    this.upcoming90DaysSpikes = const [],
    this.categoryBreakdown = const CategoryBreakdown(),
  });

  factory AnalyticsSummary.fromJson(Map<String, dynamic> json) {
    final rawSpikes = json['upcoming90DaysSpikes'];
    List<CashSpike> spikes = [];
    if (rawSpikes is List) {
      spikes = rawSpikes
          .map((s) => CashSpike.fromJson(s as Map<String, dynamic>))
          .toList();
    }

    return AnalyticsSummary(
      estMonthlySpend: (json['estMonthlySpend'] as num?)?.toDouble() ?? 0.0,
      annualizedSpend: (json['annualizedSpend'] as num?)?.toDouble() ?? 0.0,
      dueThisMonth: (json['dueThisMonth'] as num?)?.toDouble() ?? 0.0,
      upcoming90DaysSpikes: spikes,
      categoryBreakdown: json['categoryBreakdown'] != null
          ? CategoryBreakdown.fromJson(json['categoryBreakdown'] as Map<String, dynamic>)
          : const CategoryBreakdown(),
    );
  }

  Map<String, dynamic> toJson() => {
        'estMonthlySpend': estMonthlySpend,
        'annualizedSpend': annualizedSpend,
        'dueThisMonth': dueThisMonth,
        'upcoming90DaysSpikes':
            upcoming90DaysSpikes.map((s) => s.toJson()).toList(),
        'categoryBreakdown': categoryBreakdown.toJson(),
      };
}
