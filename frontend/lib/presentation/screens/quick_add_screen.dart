import 'package:flutter/material.dart';
import '../../core/constants/templates.dart';
import '../../core/theme/due_theme.dart';
import '../../data/models/enums.dart';
import '../../data/models/tracked_item.dart';
import '../widgets/bento_card.dart';
import '../widgets/due_button.dart';
import '../widgets/due_input.dart';

class QuickAddScreen extends StatefulWidget {
  final ValueChanged<TrackedItem> onSave;
  final VoidCallback onCancel;
  final TrackedItem? initialItem;

  const QuickAddScreen({
    super.key,
    required this.onSave,
    required this.onCancel,
    this.initialItem,
  });

  @override
  State<QuickAddScreen> createState() => _QuickAddScreenState();
}

class _QuickAddScreenState extends State<QuickAddScreen> {
  late final TextEditingController _titleController;
  late final TextEditingController _amountController;
  late final TextEditingController _notesController;

  late Category _category;
  late BillingCycle _billingCycle;
  late DateTime _nextDueDate;
  late List<int> _reminderDaysBefore;
  String? _templateKey;

  @override
  void initState() {
    super.initState();
    final item = widget.initialItem;
    _titleController = TextEditingController(text: item?.title ?? '');
    _amountController = TextEditingController(
      text: item?.amount != null ? item!.amount!.round().toString() : '',
    );
    _notesController = TextEditingController(text: item?.notes ?? '');
    _category = item?.category ?? Category.subscription;
    _billingCycle = item?.billingCycle ?? BillingCycle.monthly;
    _nextDueDate = item?.nextDueDate ?? DateTime.now().add(const Duration(days: 14));
    _reminderDaysBefore = item?.reminderDaysBefore ?? [7, 3, 1];
    _templateKey = item?.templateKey;
  }

  @override
  void dispose() {
    _titleController.dispose();
    _amountController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  void _applyTemplate(ItemTemplate template) {
    setState(() {
      _titleController.text = template.name;
      _category = template.category;
      _billingCycle = template.defaultBillingCycle;
      if (template.defaultCost > 0) {
        _amountController.text = template.defaultCost.round().toString();
      }
      _reminderDaysBefore = List<int>.from(template.defaultRemindDaysBefore);
      _templateKey = template.id;
    });
  }

  void _handleSave() {
    final title = _titleController.text.trim();
    if (title.isEmpty) return;

    final amountVal = double.tryParse(_amountController.text.trim());

    final item = TrackedItem(
      id: widget.initialItem?.id ?? 'item-${DateTime.now().millisecondsSinceEpoch}',
      title: title,
      category: _category,
      amount: amountVal,
      billingCycle: _billingCycle,
      nextDueDate: _nextDueDate,
      reminderDaysBefore: _reminderDaysBefore,
      notes: _notesController.text.trim().isEmpty ? null : _notesController.text.trim(),
      templateKey: _templateKey,
      status: widget.initialItem?.status ?? ItemStatus.active,
      attachments: widget.initialItem?.attachments ?? const [],
    );

    widget.onSave(item);
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? DueColors.canvasDark : DueColors.canvas,
      appBar: AppBar(
        title: Text(
          widget.initialItem != null ? 'Edit Due Item' : 'Add Due Item',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.close_rounded),
          onPressed: widget.onCancel,
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16.0),
        children: [
          // 1. Quick Templates Carousel
          Text(
            'Quick Templates',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
            ),
          ),
          const SizedBox(height: 8),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: prebuiltTemplates.take(8).map((t) {
                final isSelected = _templateKey == t.id;
                return Padding(
                  padding: const EdgeInsets.only(right: 8.0),
                  child: ActionChip(
                    label: Text(t.name),
                    backgroundColor: isSelected
                        ? (isDark ? DueColors.primaryDark : DueColors.primary)
                        : (isDark ? DueColors.surfaceDark : DueColors.surface),
                    labelStyle: TextStyle(
                      color: isSelected
                          ? Colors.white
                          : (isDark ? DueColors.textPrimaryDark : DueColors.textPrimary),
                      fontWeight: FontWeight.w600,
                      fontSize: 12,
                    ),
                    onPressed: () => _applyTemplate(t),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 16),

          // 2. Title Input
          DueInput(
            label: 'Title',
            hintText: 'e.g. Netflix, STNK, SIM',
            controller: _titleController,
          ),
          const SizedBox(height: 12),

          // 3. Category Selector
          Text(
            'Category',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
            ),
          ),
          const SizedBox(height: 6),
          Row(
            children: Category.values.map((cat) {
              final isSelected = _category == cat;
              return Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 2.0),
                  child: GestureDetector(
                    onTap: () => setState(() => _category = cat),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? (isDark ? DueColors.primaryDark : DueColors.primary)
                            : (isDark ? DueColors.surfaceDark : DueColors.surface),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: isSelected
                              ? Colors.transparent
                              : (isDark ? DueColors.borderSubtleDark : DueColors.borderSubtle),
                        ),
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        cat.displayName,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: isSelected
                              ? Colors.white
                              : (isDark ? DueColors.textSecondaryDark : DueColors.textSecondary),
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 12),

          // 4. Amount Input
          DueInput(
            label: 'Amount (Optional)',
            hintText: 'e.g. 186000',
            keyboardType: TextInputType.number,
            controller: _amountController,
          ),
          const SizedBox(height: 12),

          // 5. Billing Cycle Selector
          Text(
            'Billing Cycle',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
            ),
          ),
          const SizedBox(height: 6),
          Row(
            children: BillingCycle.values.map((cycle) {
              final isSelected = _billingCycle == cycle;
              return Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 2.0),
                  child: GestureDetector(
                    onTap: () => setState(() => _billingCycle = cycle),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? (isDark ? DueColors.primaryDark : DueColors.primary)
                            : (isDark ? DueColors.surfaceDark : DueColors.surface),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: isSelected
                              ? Colors.transparent
                              : (isDark ? DueColors.borderSubtleDark : DueColors.borderSubtle),
                        ),
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        cycle.displayName,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: isSelected
                              ? Colors.white
                              : (isDark ? DueColors.textSecondaryDark : DueColors.textSecondary),
                        ),
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 16),

          // 6. Next Due Date Selector
          BentoCard(
            onTap: () async {
              final picked = await showDatePicker(
                context: context,
                initialDate: _nextDueDate,
                firstDate: DateTime.now().subtract(const Duration(days: 365)),
                lastDate: DateTime.now().add(const Duration(days: 3650)),
              );
              if (picked != null) {
                setState(() => _nextDueDate = picked);
              }
            },
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Next Due Date',
                      style: TextStyle(
                        fontSize: 12,
                        color: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${_nextDueDate.day}/${_nextDueDate.month}/${_nextDueDate.year}',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
                      ),
                    ),
                  ],
                ),
                Icon(
                  Icons.calendar_today_rounded,
                  size: 20,
                  color: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // 7. Save CTA Button (HIG minimum 44pt touch target)
          DueButton(
            title: 'Save Item',
            onPressed: _handleSave,
          ),
        ],
      ),
    );
  }
}
