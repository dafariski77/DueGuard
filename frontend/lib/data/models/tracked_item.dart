import 'enums.dart';

class AttachmentItem {
  final String id;
  final String fileName;
  final String? viewUrl;
  final String? mimeType;

  const AttachmentItem({
    required this.id,
    required this.fileName,
    this.viewUrl,
    this.mimeType,
  });

  factory AttachmentItem.fromJson(Map<String, dynamic> json) {
    return AttachmentItem(
      id: json['id'] as String? ?? '',
      fileName: json['fileName'] as String? ?? 'attachment',
      viewUrl: json['viewUrl'] as String?,
      mimeType: json['mimeType'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'fileName': fileName,
        if (viewUrl != null) 'viewUrl': viewUrl,
        if (mimeType != null) 'mimeType': mimeType,
      };
}

class TrackedItem {
  final String id;
  final String title;
  final Category category;
  final String? templateKey;
  final double? amount;
  final BillingCycle billingCycle;
  final DateTime nextDueDate;
  final List<int> reminderDaysBefore;
  final String? notes;
  final String? cancelUrl;
  final ItemStatus status;
  final List<AttachmentItem> attachments;

  const TrackedItem({
    required this.id,
    required this.title,
    required this.category,
    this.templateKey,
    this.amount,
    required this.billingCycle,
    required this.nextDueDate,
    this.reminderDaysBefore = const [7, 1],
    this.notes,
    this.cancelUrl,
    this.status = ItemStatus.active,
    this.attachments = const [],
  });

  int get daysRemaining => calculateDaysRemaining();

  int calculateDaysRemaining([DateTime? clock]) {
    final now = clock ?? DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final due = DateTime(nextDueDate.year, nextDueDate.month, nextDueDate.day);
    return due.difference(today).inDays;
  }

  factory TrackedItem.fromJson(Map<String, dynamic> json) {
    double? parsedAmount;
    if (json['amount'] != null) {
      parsedAmount = double.tryParse(json['amount'].toString());
    }

    final rawReminders = json['reminderDaysBefore'];
    List<int> reminders = [7, 1];
    if (rawReminders is List) {
      reminders = rawReminders.map((e) => (e as num).toInt()).toList();
    }

    final rawAttachments = json['attachments'];
    List<AttachmentItem> atts = [];
    if (rawAttachments is List) {
      atts = rawAttachments
          .map((a) => AttachmentItem.fromJson(a as Map<String, dynamic>))
          .toList();
    }

    return TrackedItem(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      category: Category.fromBackendString(json['category'] as String? ?? 'SUBSCRIPTION'),
      templateKey: json['templateKey'] as String?,
      amount: parsedAmount,
      billingCycle: BillingCycle.fromBackendString(json['billingCycle'] as String? ?? 'MONTHLY'),
      nextDueDate: DateTime.parse(json['nextDueDate'] as String),
      reminderDaysBefore: reminders,
      notes: json['notes'] as String?,
      cancelUrl: json['cancelUrl'] as String?,
      status: ItemStatus.fromBackendString(json['status'] as String? ?? 'ACTIVE'),
      attachments: atts,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'category': category.toBackendString(),
        if (templateKey != null) 'templateKey': templateKey,
        if (amount != null) 'amount': amount,
        'billingCycle': billingCycle.toBackendString(),
        'nextDueDate': nextDueDate.toIso8601String(),
        'reminderDaysBefore': reminderDaysBefore,
        if (notes != null) 'notes': notes,
        if (cancelUrl != null) 'cancelUrl': cancelUrl,
        'status': status.toBackendString(),
        'attachments': attachments.map((a) => a.toJson()).toList(),
      };
}
