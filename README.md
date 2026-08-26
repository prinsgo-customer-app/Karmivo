# KARMIVO Customer App

> **One Platform. Every Service.**

The KARMIVO Customer App is a modern, fast, scalable, and production-ready mobile application built using React Native and Expo. It serves as the customer-facing interface for the multi-service KARMIVO platform.

---

## 📌 Overview

The application is completely dynamic and **Admin-controlled**. Normal content management changes—such as home banners, service categories, pricing, feature toggles (like wallet or subscription), and Help Center text—are fetched directly from the KARMIVO backend. This means the app updates in real-time without requiring a new APK or App Store update.

---

## 🚀 Main Features & Customer Flows

- **Authentication & Account Management:**
  - Dynamic login via OTP or Password based on Admin CMS rules.
  - Secure, encrypted session token management.
  - Profile management including customizable addresses and settings.
- **Services & Booking Flow:**
  - Real-time fetching of service categories, details, and dynamic pricing.
  - Location and scheduling selection for service bookings.
  - *Note:* The application does **not** calculate final pricing or taxes on the frontend. It always requests a secure calculation from the backend.
- **Wallet & Payment Flow:**
  - Viewing of available balances and recent transaction history.
  - Feature toggle support (can be enabled/disabled remotely by Admin).
- **Orders & History:**
  - Real-time tracking of order statuses (Requested, Accepted, In Progress, Completed, etc.).
  - Search, filter, and review completed services.
- **Profile & Settings:**
  - Push notification preferences, theme settings (dark mode pending full support), and secure account deletion.
- **Help, FAQ, Legal & Support:**
  - Dynamic fetching of FAQs and legal policies from the backend.
  - Admin-configured emergency and support contact numbers.
- **Notifications:**
  - In-app notification center for order updates, wallet credits, and promotional messages.
- **Referral & Rewards / Offers:**
  - Dynamic banner sliders on the Home screen for promotional campaigns.
  - Coupon application during the booking flow securely validated by the backend.

---

## 🏗 Architecture & Backend Integration

### Backend Communication
The Customer App communicates exclusively with the main KARMIVO backend (production environment).
- **Base API URL:** `https://karmivo-backend.onrender.com` (Configurable via `EXPO_PUBLIC_API_URL`).
- **Centralized API Layer:** Uses Axios with interceptors to automatically append secure Auth tokens, handle robust timeouts (to account for server cold-starts), and catch `401 Unauthorized` responses to gracefully log out the user.

### Secure Storage & Authentication
- All authentication tokens and sensitive user session data are stored using `expo-secure-store`.
- No sensitive keys, database credentials, or payment secrets are stored inside the client application.

### State Management & Theming
- Global application state (Authentication, User Data, Admin CMS configuration) is managed via **Zustand**.
- A centralized theme configuration (colors, spacing, typography) ensures brand consistency across the app.

### Error, Loading & Offline Handling
Every backend-driven screen is equipped with professional fallback states:
- **Skeleton/Loading States:** Displayed while data is being fetched.
- **Empty States:** Clean UI when no data is available (e.g., "No orders found").
- **Error States:** Graceful error cards with "Try Again" mechanisms if network requests fail or timeout.

---

## 📂 Folder Structure

```text
Karmivo-Customer/
├── src/
│   ├── api/          # Axios client, interceptors, and API configuration
│   ├── components/   # Reusable UI components (Buttons, Typography, ErrorStates)
│   ├── navigation/   # React Navigation stack & tab configuration
│   ├── screens/      # App screens (Home, Profile, Booking, Wallet, etc.)
│   ├── store/        # Zustand global state (AuthStore, AppStore)
│   ├── theme/        # Centralized styling and brand colors
│   ├── types/        # TypeScript interfaces mapping to backend entities
│   └── utils/        # Helper functions
├── App.tsx           # Application entry point
├── app.json          # Expo configuration
├── package.json      # Dependencies and scripts
└── .env.example      # Example environment configuration
```

---

## 🛠 Installation & Development

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo CLI

### 2. Setup Environment Variables
Copy the example environment file and configure it:
```bash
cp .env.example .env
```
Ensure `.env` contains:
```env
EXPO_PUBLIC_API_URL=https://karmivo-backend.onrender.com
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm start
```
Use the Expo Go app on your physical device to scan the QR code, or press `a` to open it in an Android emulator.

---

## 📦 Build & Deployment Notes

### Android APK/AAB Build Instructions
The project is built using EAS (Expo Application Services).
1. Ensure your `app.json` has the correct `android.package` identifier (e.g., `com.karmivo.customer`).
2. Run the EAS build command for a production APK or AAB:
   ```bash
   eas build -p android --profile production
   ```

### Future App Store Preparations
- The app architecture is entirely cross-platform.
- iOS builds will require specific Apple Developer certificates configured via EAS:
  ```bash
  eas build -p ios --profile production
  ```

### Security & Privacy Considerations
- **No Dummy Data:** The app strictly connects to the live backend.
- **Permissions:** Only essential permissions (e.g., Location for bookings) are requested dynamically. Ensure `app.json` accurately reflects privacy requirements for Google Play and Apple App Store submissions.

---

## 🐛 Troubleshooting & Common Issues

- **App stuck on Splash Screen:** The app pings the backend (`/api/v1/config`) on startup. If the backend is asleep (Render cold start) or your internet is unstable, wait 15 seconds. If it times out, an Error State will appear with a "Try Again" button.
- **Cannot Apply Coupon:** Coupon validation is strictly backend-enforced. If a coupon fails, verify that it is active in the Admin panel.
- **Session Expired Unexpectedly:** If your Auth token expires on the server, the Axios interceptor catches the `401` error, clears the `secure-store`, and routes you back to the Login screen safely.
