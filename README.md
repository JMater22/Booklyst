# 🎉 Booklyst - Event Venue Booking Platform

A comprehensive mobile-first venue booking platform built with Ionic, React, and TypeScript.

![Booklyst](https://img.shields.io/badge/Status-Completed-success)
![Ionic](https://img.shields.io/badge/Ionic-7.6-blue)
![React](https://img.shields.io/badge/React-18.2-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6)

## 🎯 Overview

Booklyst is a full-featured prototype venue booking platform that connects customers with event venues in the Philippines. It features a complete booking workflow, venue management for owners, and a beautiful purple-themed UI.

**Type:** Frontend-only prototype with localStorage persistence
**Status:** ✅ Fully Functional
**Platform:** Web, iOS, Android (via Capacitor)

## 🛠️ Tech Stack

- **Framework:** Ionic 7 + React 18
- **Language:** TypeScript 5
- **Build Tool:** Vite
- **Routing:** React Router 5
- **Mobile Runtime:** Capacitor 5
- **UI Library:** Ionic Components
- **Icons:** Ionicons
- **Carousel:** Swiper
- **Styling:** CSS Variables + Ionic theming

## ✨ Features

### 🎨 Customer Features

#### Venue Discovery
- ✅ Browse all available venues
- ✅ Search by name or location
- ✅ Filter by category (Ballroom, Garden, Conference, Restaurant, Events Hall)
- ✅ Featured venues carousel
- ✅ Beautiful venue cards with images
- ✅ Rating and review display

#### Venue Details
- ✅ Full-screen image gallery with swipeable carousel
- ✅ Complete venue information (capacity, pricing, location)
- ✅ Amenities list with icons
- ✅ House rules and operating hours
- ✅ Customer reviews with ratings
- ✅ Favorite/unfavorite button
- ✅ Share functionality

#### Booking System
- ✅ **Step 1:** Event details (name, type, date, time, guests)
- ✅ **Step 2:** Optional service packages (catering, decoration, photography)
- ✅ **Step 3:** Review booking and pricing breakdown
- ✅ **Step 4:** Mock payment (GCash, Credit/Debit Card)
- ✅ **Step 5:** Booking confirmation
- ✅ Real-time pricing calculator with 5% service fee
- ✅ 30% deposit requirement
- ✅ Booking reference number generation

#### My Bookings
- ✅ Tabbed interface (Upcoming / Past / Cancelled)
- ✅ Booking cards with venue info, status, and actions
- ✅ Cancel booking functionality
- ✅ View booking details
- ✅ Pull-to-refresh

#### Favorites
- ✅ Save favorite venues
- ✅ View all favorited venues
- ✅ Quick access from profile
- ✅ Remove from favorites

#### Profile & Settings
- ✅ User information display
- ✅ Avatar with initials
- ✅ Access to bookings and favorites
- ✅ Logout functionality

### 🏢 Venue Owner Features

#### Owner Dashboard
- ✅ Statistics overview (Total venues, bookings, pending, revenue)
- ✅ Quick action buttons (Add venue, Manage venues)
- ✅ List of owned venues
- ✅ Recent bookings with status
- ✅ Pull-to-refresh

#### Venue Management
- ✅ Add new venues with comprehensive form
- ✅ Set venue details (name, category, description)
- ✅ Configure location and address
- ✅ Define capacity range
- ✅ Set pricing (min/max)
- ✅ Select amenities
- ✅ Add operating hours and house rules
- ✅ Form validation

## 🎨 Design System

### Color Palette
- **Primary Purple:** `#7C3AED`
- **Orange Accent:** `#F97316`
- **Success Green:** `#10B981`
- **Warning Yellow:** `#F59E0b`
- **Danger Red:** `#EF4444`

### Key Design Elements
- ✨ Clean, modern interface
- ✨ Consistent spacing and typography
- ✨ Smooth animations and transitions
- ✨ Card-based layouts
- ✨ Responsive grid system
- ✨ Image error handling with gradient placeholders

## 🚀 Getting Started

### Prerequisites

```bash
Node.js 18+
npm or yarn
```

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/booklyst.git
   cd Booklyst
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser

4. **Run with Ionic CLI:**
   ```bash
   ionic serve
   ```

### Mobile Development

#### Android
```bash
# Add Android platform
npx cap add android

# Sync changes
npx cap sync android

# Open in Android Studio
npx cap open android
```

#### iOS
```bash
# Add iOS platform
npx cap add ios

# Sync changes
npx cap sync ios

# Open in Xcode
npx cap open ios
```

## 📁 Project Structure

```
Booklyst/
├── src/
│   ├── components/           # Reusable UI components
│   │   └── venue/           # VenueCard component
│   ├── pages/               # Screen components
│   │   ├── auth/            # Login, Register
│   │   ├── customer/        # Home, VenueDetails, BookingFlow,
│   │   │                    # MyBookings, Favorites, Profile
│   │   └── owner/           # OwnerDashboard, VenueForm
│   ├── services/            # Business logic
│   │   ├── authService.ts   # Authentication
│   │   ├── venueService.ts  # Venue management
│   │   ├── bookingService.ts # Booking management
│   │   ├── reviewService.ts # Reviews
│   │   └── storageService.ts # localStorage wrapper
│   ├── types/               # TypeScript interfaces
│   │   ├── user.types.ts
│   │   ├── venue.types.ts
│   │   └── booking.types.ts
│   ├── data/                # Mock data
│   │   ├── mockUsers.json
│   │   ├── mockVenues.json
│   │   ├── mockReviews.json
│   │   └── mockServicePackages.json
│   ├── theme/               # Design tokens
│   │   ├── variables.css    # Color variables
│   │   └── global.css       # Global styles
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── public/
│   └── assets/              # Static assets
├── capacitor.config.ts      # Capacitor configuration
├── ionic.config.json        # Ionic configuration
├── vite.config.ts           # Vite configuration
└── package.json             # Dependencies
```

## 🧪 Test Accounts

### Customer Account
- **Email:** `customer@test.com`
- **Password:** `password123`
- **Features:** Browse venues, make bookings, favorites

### Venue Owner Account
- **Email:** `owner@test.com`
- **Password:** `password123`
- **Features:** Dashboard, manage venues, view bookings

## 📱 App Flow

### Customer Journey
```
Login → Home (Browse Venues) → Venue Details → Booking Flow → Confirmation → My Bookings
   ↓
Profile → Favorites
```

### Owner Journey
```
Login → Dashboard → Add/Manage Venues → View Bookings
```

## 🔒 Mock Implementation

This prototype uses local storage and mock data:

- ✅ **Authentication:** Mock login with hardcoded test accounts
- ✅ **Data Persistence:** localStorage for user data
- ✅ **Payment:** Simulated payment flow (always succeeds)
- ✅ **Images:** Placeholder images from Unsplash/Picsum
- ✅ **Reviews:** Pre-populated mock reviews
- ✅ **Services:** JSON files + runtime data

## 🌟 Production Considerations

To convert this to a production application, implement:

### Backend & Database
- [ ] Node.js + Express REST API
- [ ] PostgreSQL or MongoDB database
- [ ] Supabase for real-time features
- [ ] File upload for venue images (S3/Cloudinary)

### Authentication & Security
- [ ] JWT-based authentication
- [ ] Secure password hashing (bcrypt)
- [ ] Email verification
- [ ] Password reset flow
- [ ] Rate limiting

### Payment Integration
- [ ] PayMongo integration
- [ ] GCash API
- [ ] Credit/Debit card processing
- [ ] Payment webhooks
- [ ] Refund handling

### Notifications
- [ ] Push notifications (FCM)
- [ ] Email notifications (SendGrid)
- [ ] SMS notifications (Twilio)
- [ ] In-app notifications

### Additional Features
- [ ] Real-time messaging
- [ ] Calendar availability
- [ ] Booking conflicts prevention
- [ ] Multi-image upload
- [ ] Advanced search filters
- [ ] Map integration
- [ ] Admin dashboard
- [ ] Analytics

## 📊 Key Metrics

- **Total Components:** 15+
- **Total Pages:** 12
- **Lines of Code:** ~8,000+
- **Service Modules:** 5
- **Mock Data Entries:** 20+

## 🧪 Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🐛 Known Limitations

- Frontend-only (no real backend)
- Mock authentication (not secure)
- localStorage limited to browser
- No real payment processing
- Images from placeholder services
- No data validation on backend

## 🤝 Contributing

This is an educational project. Feel free to fork and experiment!

## 📄 License

MIT License - feel free to use for learning purposes

## 👨‍💻 Credits

Built with:
- Ionic Framework
- React
- TypeScript
- Vite
- Swiper
- Ionicons

---

**🔥 Made with ❤️ using Ionic + React + TypeScript**

**📱 Ready for Web, iOS, and Android deployment**
