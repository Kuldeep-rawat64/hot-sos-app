# HotSosApp

## Goal

Create a **mobile application using Angular + Capacitor (no Ionic UI)** implementing:

1. **PIN login flow**
2. **Bottom tab navigation** (Housekeeping, Service Orders, Guests, More) with hamburger menu
3. **Cleaning – All Rooms Assignment UI**

---

## 🚀 Tech Stack

- Angular (Frontend framework)
- Capacitor (Native runtime bridge)
- Android Studio (Android builds)
- Xcode (iOS builds)
- TypeScript
- SCSS
- Angular CDK / Angular Material (for overlays & bottom sheet)

---

# Part A — App Setup

## 1. Create Angular App + Integrate Capacitor

- Angular application created using Angular CLI
- Capacitor integrated for native Android and iOS builds
- No Ionic UI components used

## 2. Configuration

### Platforms

- Android platform configured
- iOS platform configured

### Environment Configurations

Environment files:

```
src/environments/
 ├── environment.ts        # dev
 ├── environment.qa.ts     # qa
 └── environment.prod.ts   # production
```

Build example:

```bash
ng build --configuration production
```

---

## 3. Folder Structure

```
src/app/
│
├── core/        # singleton services, interceptors, guards, storage
├── shared/      # reusable UI components, directives, pipes
├── features/
│   ├── auth/
│   ├── guests/
│   └── shell/
```

### Structure Responsibilities

- **core/**
  - API services
  - HTTP interceptors
  - auth guards
  - secure storage services

- **shared/**
  - reusable UI components
  - buttons, inputs, layout helpers

- **features/**
  - domain-based feature modules

---

## Deliverable

- Git repository
- README including setup, run, and build steps

---

# Part B — PIN Login

## Requirements

### 1. PIN Screen

- PIN input field
- Masked input (optional)
- Continue button enabled only when PIN length is valid

### 2. Mock API

- Authentication simulated using local JSON file

### 3. On Successful Login

- Store session token securely using:
  - Capacitor Preferences / secure storage approach
- Navigate to **Shell (Tabs layout)**

### 4. Error Handling

- Invalid PIN → inline error message + retry
- Network unavailable → offline message displayed

### Evaluation Focus

- Clean validation logic
- Route guards implementation
- Secure token storage strategy

---

# Part C — Tab Shell + More Menu

## Bottom Tab Navigation

Tabs:

- Housekeeping
- Service Orders
- Guests
- More

### More Tab

Implements **bottom sheet menu** containing:

- Amenities
- Meters
- Personnel

### Constraints

- Built using Angular CDK Overlay / Angular Material
- OR custom bottom sheet component
- ❌ No Ionic components allowed

---

# Part D — Cleaning: All Rooms Assignment

- UI design for work assignment list
- Displays cleaning assignments as shown in recording
- Focus on layout, usability, and mobile responsiveness

---

# Part E — Quality

## Unit Tests

- PIN validation logic
- Auth service
- Guests filtering & sorting logic

Run tests:

```bash
ng test
```

---

## Code Quality

- ESLint configured
- Formatting rules applied
- Consistent folder architecture

---

# 🧑‍💻 Setup Instructions

## Prerequisites

- Node.js >= 18
- npm >= 9
- Angular CLI

```bash
npm install -g @angular/cli
```

### Android

- Android Studio
- Android SDK
- Java 17

### iOS (Mac only)

- Xcode (latest)
- CocoaPods

```bash
sudo gem install cocoapods
```

---

## Initial Setup

```bash
git clone <repository-url>
cd <project-name>
npm install
```

---

## Capacitor Setup

```bash
npx cap init
npx cap add android
npx cap add ios
```

---

## Run Web Version

```bash
ng serve
```

Open:

```
http://localhost:4200
```

---

## Build Application

```bash
ng build
```

---

## Sync with Native Platforms

```bash
npx cap sync
```

---

## Run Android

```bash
ng build
npx cap sync android
npx cap open android
```

Run from Android Studio ▶

---

## Run iOS

```bash
ng build
npx cap sync ios
npx cap open ios
```

Run from Xcode ▶

---

## Production Build

### Android

```bash
ng build --configuration production
npx cap sync android
```

Generate Signed Bundle in Android Studio.

### iOS

```bash
ng build --configuration production
npx cap sync ios
```

Archive via Xcode.

---

# 🧱 Architecture Decisions

## Storage

- Session token stored using Capacitor Preferences / secure storage abstraction
- Wrapped inside Core Storage Service

## State Management

- Angular services + RxJS (lightweight state handling)
- Feature-scoped state where applicable

## Routing

- Auth Guard protects Shell routes
- Lazy-loaded feature modules

---

# 📡 Offline Strategy

- Mock API backed by local JSON
- Network errors handled gracefully
- Offline message displayed when connectivity unavailable
- Prepared structure for future caching layer

---

# ✅ Submission Checklist

- Git repository (or zip)
- README containing:
  - setup instructions
  - run steps
  - Android/iOS build steps
  - architecture decisions
  - offline strategy

### Screenshots / Recording Required

- PIN login screen
- Tab navigation
- Work assignments screen

---

# 📄 License

MIT License
# hot-sos-app
