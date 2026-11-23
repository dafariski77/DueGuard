import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dueguard/main.dart';

void main() {
  testWidgets('DueGuardApp launches with root navigation and upcoming items', (WidgetTester tester) async {
    tester.view.physicalSize = const Size(1000, 3000);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(() {
      tester.view.resetPhysicalSize();
      tester.view.resetDevicePixelRatio();
    });

    await tester.pumpWidget(const DueGuardApp());
    await tester.pumpAndSettle();

    expect(find.text('Upcoming'), findsWidgets);
    expect(find.text('Netflix Premium'), findsWidgets);
    expect(find.text('Radar'), findsOneWidget);
    expect(find.text('Control'), findsOneWidget);
  });
}
