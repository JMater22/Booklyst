# Booklyst - Event Venue Booking Platform

A mobile app prototype for booking event venues in the Philippines.

## 🎯 Overview

Booklyst is a comprehensive venue booking and event planning platform that combines customer features (venue discovery, booking, service coordination) with venue owner features (listings and bookings management).

**Type:** Frontend-only prototype with mock data
**Status:** 🚧 In Development

## 🛠️ Tech Stack

- **Framework:** Ionic 7 + React 18
- **Mobile:** Capacitor 5
- **Language:** TypeScript
- **Build Tool:** Vite
- **Routing:** React Router 5
- **UI Components:** Ionic Components
- **Icons:** Ionicons

## ✨ Features

### Customer Features
- 🔍 Browse and search venues
- 📍 Location-based filtering
- 💰 Real-time pricing calculator
- 📅 Book venues with mock payment
- ❤️ Save favorite venues
- ⭐ Leave reviews and ratings
- 📱 Manage bookings

### Venue Owner Features
- 🏢 Create and manage venue listings
- 📸 Upload venue photos
- 💵 Set pricing and packages
- 📊 View bookings dashboard
- ✅ Approve/reject bookings
- 💬 Message customers

## 🎨 Design

The app features a beautiful purple-themed interface (#7C3AED) with:
- Clean, modern UI
- Smooth animations
- Responsive design
- Accessible components

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Ionic CLI: `npm install -g @ionic/cli`

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Booklyst
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run in browser:
   ```bash
   npm run dev
   ```

   App will be available at `http://localhost:5173/`

4. Run on Android:
   ```bash
   npx cap add android
   ionic cap run android
   ```

5. Run on iOS:
   ```bash
   npx cap add ios
   ionic cap run ios
   ```

## 📁 Project Structure

```
Booklyst/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── common/      # Buttons, inputs, cards
│   │   ├── venue/       # Venue-related components
│   │   ├── booking/     # Booking components
│   │   └── owner/       # Owner portal components
│   ├── pages/           # Screen components
│   │   ├── auth/        # Login, register
│   │   ├── customer/    # Customer screens
│   │   ├── owner/       # Owner portal screens
│   │   └── shared/      # Shared screens
│   ├── services/        # Business logic & API
│   ├── context/         # React Context
│   ├── hooks/           # Custom hooks
│   ├── types/           # TypeScript types
│   ├── data/            # Mock data JSON files
│   ├── theme/           # Design system
│   └── utils/           # Helper functions
├── public/
│   └── assets/          # Images, icons
└── capacitor.config.ts  # Capacitor configuration
```

## 🧪 Test Accounts

- **Customer:** `customer@test.com` / `password123`
- **Owner:** `owner@test.com` / `password123`

## 🔒 Mock Implementation

This is a frontend-only prototype using:
- ✅ localStorage for data persistence
- ✅ Mock authentication (no real backend)
- ✅ Simulated payment processing
- ✅ JSON files for initial data
- ✅ No real APIs or database

## 🌟 Future Production Features

To convert this to a production app, add:
- Real backend (Node.js + Express)
- Database (Supabase)
- PayMongo payment integration
- Push notifications
- Email/SMS notifications
- Admin panel
- Real-time messaging

## 📝 Development Roadmap

- [x] Phase 1: Project Setup & Design System
- [ ] Phase 2: Authentication & Navigation
- [ ] Phase 3: Venue Discovery
- [ ] Phase 4: Booking Flow
- [ ] Phase 5: Reviews & Favorites
- [ ] Phase 6: Owner Portal
- [ ] Phase 7: Messaging & Notifications
- [ ] Phase 8: Polish & Testing
- [ ] Phase 9: Build & Deploy

## 🤝 Contributing

This is an educational project. Contributions are welcome!

## 📄 License

MIT

## 👨‍💻 Author

Created as part of a mobile app development course.

---

**🔥 Built with Ionic + React + TypeScript**
