# DueGuard (v1.0 MVP)

Personal & Household Renewal Guardian — Never get caught by surprise renewals again.

---

## 1. System Architecture

The repository is strictly separated into a two-tier layout:

```text
dueguard/
├── backend/                  # NestJS Standalone API (Prisma, PostgreSQL, Redis, BullMQ)
│   ├── prisma/               # Database schema & migrations
│   ├── src/
│   │   ├── auth/             # JWT auth & Apple/Google sign-in token verification
│   │   ├── items/            # Tracked items CRUD, renew, and tier limits
│   │   ├── analytics/        # Spend run-rate, 90-day spikes & category distribution
│   │   ├── notifications/    # Smart multi-stage notification dispatch
│   │   └── common/           # Shared schemas, enums & 32 pre-built templates
│   ├── docker-compose.yml    # Isolated PostgreSQL & Redis bridge network
│   └── package.json
└── frontend/                 # Flutter 3.50+ / Dart 3.14+ Native Mobile Client
    ├── lib/
    │   ├── core/             # Theme tokens, 32 templates & ApiClient
    │   ├── data/             # Models, enums & repositories (Items, Analytics)
    │   └── presentation/     # Bento Design System widgets, screens & modals
    ├── test/                 # 24 unit & widget tests covering all screens & flows
    └── pubspec.yaml
```

---

## 2. Bento Hybrid Design System & HIG Implementation

* **Bento Grid:** 16pt card radius with slate (`#F8FAFC` / `#0B0F19`) and indigo (`#4F46E5` / `#6366F1`) high-trust palette.
* **Ergonomics & Touch Targets:** Apple HIG minimum 44pt touch target across all primary and secondary buttons (`DueButton`).
* **Tabular Numbers:** Tabular figure features for all monetary sums, dates, and countdown badges.
* **Row 3 Core Screens:**
  1. `HomeScreen`: Hero upcoming due item, split burn cards (`estMonthlySpend` / slots tracker), category filter chips (`All`, `Subscriptions`, `Warranties`, `Bills & IDs`), timeline list, floating action button (`+ Add Due Item`).
  2. `QuickAddScreen`: 32 pre-built templates carousel, title input, category selector, billing cycle selector, due date picker, reminder stage toggles.
  3. `DetailScreen`: Digital pass hero, specifications grid, Proof Vault thumbnail gallery with 2-file Free tier limit check, Mark Paid and Delete callbacks.
  4. `SpendRadarScreen`: Monthly run-rate hero, 90-day cash spike radar cards, category breakdown progress bars.
  5. `SettingsScreen`: Profile, Face ID biometric switch, push notifications switch, Restore Purchases, Apple 5.1.1(v) Delete Account button.
* **Row 4 Extended Modals & Dialogs:**
  1. `PaywallModal`: Annual 7-day free trial vs Monthly selector, Pro feature checklist, Restore Purchases button.
  2. `ProofVaultViewer`: High-res document viewer with Share, Save, and Delete options.
  3. `RenewalAffirmationSheet`: Bottom sheet with celebration checkmark, rolled next due date, active 5-second countdown Undo button.
  4. `NotificationConsentModal`: Pre-permission dialog explaining notification stages (30d, 7d, 3d, 1d).
  5. `DeleteConsentDialog`: Account deletion warning requiring typed confirmation.
  6. `OnboardingScreen`: Value carousel and quick starter template picker.

---

## 3. Running & Testing

### Backend (NestJS)

```bash
cd backend
npm install
npx prisma generate
npm test                # Runs 26 unit tests across 9 suites
npm run start:dev       # Starts NestJS server on port 3000
```

### Frontend (Flutter)

```bash
cd frontend
flutter pub get
flutter test            # Runs all 24 unit, widget & repository tests
flutter analyze         # Confirms 0 issues / lints
flutter run             # Launches mobile client on simulator or device
```
