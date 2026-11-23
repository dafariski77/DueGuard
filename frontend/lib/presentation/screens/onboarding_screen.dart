import 'package:flutter/material.dart';
import '../../core/constants/templates.dart';
import '../../core/theme/due_theme.dart';
import '../widgets/bento_card.dart';
import '../widgets/due_button.dart';

class OnboardingScreen extends StatefulWidget {
  final ValueChanged<List<String>> onComplete;

  const OnboardingScreen({
    super.key,
    required this.onComplete,
  });

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final Set<String> _selectedTemplates = {'netflix', 'spotify'};

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? DueColors.canvasDark : DueColors.canvas,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 16),
              Text(
                'Welcome to DueGuard',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                  color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Select services you use to get started with calm, automatic renewal reminders.',
                style: TextStyle(
                  fontSize: 14,
                  color: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
                ),
              ),
              const SizedBox(height: 24),

              // Starter Template Selector
              Text(
                'Popular Services',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
                ),
              ),
              const SizedBox(height: 12),
              Expanded(
                child: ListView(
                  children: prebuiltTemplates.take(10).map((template) {
                    final isSelected = _selectedTemplates.contains(template.id);
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 8.0),
                      child: BentoCard(
                        variant: isSelected ? BentoVariant.highlight : BentoVariant.standard,
                        onTap: () {
                          setState(() {
                            if (isSelected) {
                              _selectedTemplates.remove(template.id);
                            } else {
                              _selectedTemplates.add(template.id);
                            }
                          });
                        },
                        child: Row(
                          children: [
                            Icon(
                              isSelected ? Icons.check_circle_rounded : Icons.radio_button_unchecked,
                              color: isSelected ? DueColors.primary : DueColors.textMuted,
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    template.name,
                                    style: TextStyle(
                                      fontSize: 15,
                                      fontWeight: FontWeight.w600,
                                      color: isDark ? DueColors.textPrimaryDark : DueColors.textPrimary,
                                    ),
                                  ),
                                  Text(
                                    '${template.category.displayName} • ${template.defaultBillingCycle.displayName}',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: isDark ? DueColors.textSecondaryDark : DueColors.textSecondary,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
              const SizedBox(height: 16),

              // Get Started CTA Button
              DueButton(
                title: 'Get Started',
                onPressed: () => widget.onComplete(_selectedTemplates.toList()),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
