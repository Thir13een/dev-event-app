# DevEvent - Project Memory

## Project Overview
This is a modern **Next.js 16** application for displaying developer events (hackathons, conferences, meetups). The app serves as "The Hub for Every Dev Event You Can't Miss" with a visually appealing interface featuring WebGL effects and a clean, responsive design.

**Current Status**: Active development - landing page complete, MongoDB backend integrated, API routes implemented, event detail page partially complete (needs full UI implementation).

---

## Tech Stack

### Core
- **Next.js**: ^16.0.10 (App Router)
- **React**: 19.2.1
- **TypeScript**: ^5 (strict mode enabled)
- **Node**: ^20

### Styling
- **Tailwind CSS**: v4 (latest major version)
- **PostCSS**: via @tailwindcss/postcss
- **Fonts**: Schibsted Grotesk (primary), Martian Mono (secondary) via next/font/google

### UI Utilities
- **class-variance-authority**: Component variant management
- **clsx** + **tailwind-merge**: Class name utilities
- **lucide-react**: Icon library
- **tw-animate-css**: Tailwind animation utilities

### Graphics
- **ogl**: WebGL library for LightRays background effect

### Backend & Database
- **MongoDB**: NoSQL database for storing events and bookings
- **Mongoose**: ^9.0.1 - ODM for MongoDB with schema validation
- **Cloudinary**: ^2.8.0 - Cloud image storage and optimization

---

## Architecture Patterns

### App Router (NOT Pages Router)
- Uses Next.js 13+ App Router in `app/` directory
- Server Components by default
- Client Components explicitly marked with `"use client"`
- No `src/` directory - components at root level

### Component Strategy
**Server Components** (default):
- `Navbar` - Static navigation
- `EventCard` - Event display cards
- `app/page.tsx` - Home page
- `app/events/[slug]/page.tsx` - Event detail page (fetches from API)

**Client Components** (interactive):
- `LightRays` - WebGL canvas background
- `ExploreBtn` - Interactive scroll button

### Data Management
- **Database**: MongoDB with Mongoose ODM
- **Connection**: Cached connection pattern in `lib/mongodb.ts` for serverless optimization
- **Static data**: Legacy event data in `lib/constants.ts` (for reference/seeding)
- **API Routes**: RESTful endpoints in `app/api/events/`
- **Type safety**: Full TypeScript interfaces via Mongoose models
- **Image storage**: Cloudinary for event images (uploaded via API)

### File Structure
```
nextjs/
├── app/                    # Next.js App Router
│   ├── api/                # API Routes
│   │   └── events/         # Event endpoints
│   │       ├── route.ts    # GET all, POST create
│   │       └── [slug]/     # GET by slug
│   ├── events/             # Event pages
│   │   └── [slug]/         # Dynamic event detail
│   ├── layout.tsx          # Root layout with fonts & metadata
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles + custom utilities
├── components/             # React components (root level)
├── database/               # Mongoose models
│   ├── event.model.ts      # Event schema & model
│   └── booking.model.ts    # Booking schema & model
├── lib/                    # Utilities and constants
│   ├── mongodb.ts          # MongoDB connection (cached)
│   └── constants.ts        # Legacy static event data
└── public/                 # Static assets
    ├── icons/              # Logo, UI icons
    └── images/             # Event posters
```

---

## Coding Conventions

### Import Paths
**ALWAYS use `@/` path alias** (configured in tsconfig.json):
```typescript
import Navbar from "@/components/Navbar";
import { events } from "@/lib/constants";
```

### TypeScript
- Strict mode enabled
- Props interfaces defined inline or exported
- Type all component props
- Target: ES2017

### Component Patterns
```typescript
// Server component (default)
export default function ComponentName() { ... }

// Client component
"use client";
export default function InteractiveComponent() { ... }

// With props
interface Props {
  title: string;
  // ...
}
export default function Component({ title }: Props) { ... }
```

### Image Optimization
**ALWAYS use `next/image`**, never `<img>`:
```typescript
import Image from "next/image";
<Image src="/icons/logo.png" alt="..." width={24} height={24} />
```

### Navigation
**Use Next.js `Link` component**:
```typescript
import Link from "next/link";
<Link href="/events">Events</Link>
```

---

## Styling Approach

### Tailwind CSS v4
Primary styling method with custom design system.

### Custom Utilities (in `app/globals.css`)
```css
@utility flex-center    /* flex items-center justify-center */
@utility text-gradient  /* White-to-cyan gradient text */
@utility glass          /* Glass morphism effect */
@utility card-shadow    /* Event card shadow */
```

### Design System (CSS Variables)
```css
--color-blue: #59deca;           /* Primary brand color (teal) */
--color-bg: #030708;             /* Dark background */
--color-light-100: #fcfcfd;      /* White */
--color-dark-100: #161a1d;       /* Dark gray */
--border-dark: #ffffff1a;        /* Border color */
--radius: 0.625rem;              /* Border radius */
```

### Typography
- **Primary font**: Schibsted Grotesk (headings, body)
- **Secondary font**: Martian Mono (code, monospace)
- Applied via CSS variables in root layout

### Responsive Design
- Mobile-first approach
- Breakpoints: `max-sm:`, `sm:`, `md:`, `lg:`
- Event grid: 1 column (mobile) → 2 (tablet) → 3 (desktop)

### Visual Effects
1. **Glass morphism**: Navbar uses backdrop-blur
2. **Text gradients**: Headings use white-to-cyan gradient
3. **WebGL background**: Animated light rays (cyan #00ffff)
4. **Card shadows**: Custom shadow on event cards

---

## API Routes & Database

### API Endpoints

#### `POST /api/events`
- Create new event
- Accepts FormData with event fields + image file
- Uploads image to Cloudinary
- Auto-generates slug from title
- Returns created event

#### `GET /api/events`
- Fetch all events
- Sorted by creation date (newest first)
- Returns array of events

#### `GET /api/events/[slug]`
- Fetch single event by slug
- Returns event object or 404

### Database Models

#### Event Model (`database/event.model.ts`)
```typescript
interface IEvent {
  title: string;
  slug: string;          // Auto-generated from title
  description: string;
  overview: string;
  image: string;         // Cloudinary URL
  venue: string;
  location: string;
  date: Date;            // Stored as UTC midnight
  time: string;          // HH:MM format (24-hour)
  mode: "online" | "offline" | "hybrid";
  audience: string;
  agenda: string[];      // Array of agenda items
  organizer: string;
  tags: string[];        // Array of tags
  createdAt: Date;       // Auto-generated
  updatedAt: Date;       // Auto-generated
}
```

**Validation:**
- Slug auto-generated on save (kebab-case from title)
- Date normalized to UTC midnight
- Time validated as HH:MM format
- Mode enum restricted to: online, offline, hybrid
- Agenda and tags must have at least one item

#### Booking Model (`database/booking.model.ts`)
```typescript
interface IBooking {
  eventId: ObjectId;     // Reference to Event
  email: string;         // Validated email format
  createdAt: Date;       // Auto-generated
  updatedAt: Date;       // Auto-generated
}
```

**Validation:**
- Email format validation
- Event existence check on save
- Email stored in lowercase

### MongoDB Connection
- Cached connection pattern in `lib/mongodb.ts`
- Optimized for serverless (Next.js edge runtime)
- Global cache prevents connection pool exhaustion
- Requires `MONGODB_URI` environment variable

### Cloudinary Configuration
- Used for event image uploads
- Stores images in "DevEvent" folder
- Returns secure HTTPS URLs
- Requires Cloudinary credentials in env variables

---

## Key Components

### `app/layout.tsx`
- Root layout with metadata
- Loads Google Fonts (Schibsted Grotesk, Martian Mono)
- Includes Navbar and LightRays

### `app/page.tsx`
- Landing page
- Displays 8 featured events from `lib/constants`
- Hero section + event grid

### `components/Navbar.tsx`
- Server component
- Logo + navigation links
- Glass morphism effect
- Links currently placeholder (all point to "/")

### `components/LightRays.tsx`
- Client component (WebGL canvas)
- Animated cyan light rays background
- Mouse interaction enabled
- Performance optimized with intersection observer

### `components/EventCard.tsx`
- Server component
- Displays event info: title, location, date, time, image
- Links to `/events/${slug}` (routes not yet created)

### `components/ExploreBtn.tsx`
- Client component
- Scroll-to-events button on home page

### `lib/constants.ts`
- Legacy event data (8 hardcoded events for reference)
- Exports lightweight `Event` type for UI display
- May be used for seeding database or fallback

### `app/events/[slug]/page.tsx`
- Server component with async data fetching
- Fetches event from `/api/events/[slug]`
- Currently displays basic event info (slug, "not found" state)
- **TODO**: Needs full UI implementation matching CSS #event styles

### `database/event.model.ts` & `database/booking.model.ts`
- Mongoose schema definitions
- Auto-slug generation on save
- Date/time validation and normalization
- Pre-save hooks for data integrity

### `lib/mongodb.ts`
- MongoDB connection utility
- Implements global cache for serverless environments
- Reuses connections across requests
- Prevents connection pool exhaustion

---

## Data Models

### UI Event Type (Legacy - `lib/constants.ts`)
Lightweight type for display components:
```typescript
export type Event = {
  title: string;      // "React Summit 2026"
  image: string;      // "/images/react-summit.png"
  slug: string;       // "react-summit-2026" (for routing)
  location: string;   // "Amsterdam, Netherlands"
  date: string;       // "June 10-13, 2026" (human-readable)
  time: string;       // "9:00 AM - 6:00 PM CEST" (human-readable)
};
```

### Database Event Model (Full - `database/event.model.ts`)
Complete model with all fields:
```typescript
interface IEvent extends Document {
  title: string;
  slug: string;          // Auto-generated
  description: string;
  overview: string;
  image: string;         // Cloudinary URL
  venue: string;
  location: string;
  date: Date;            // Date object
  time: string;          // HH:MM format
  mode: "online" | "offline" | "hybrid";
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Sample Static Events (8 total in `lib/constants.ts`)
1. React Summit 2026 (Amsterdam)
2. Next.js Conf 2025 (San Francisco)
3. Google Cloud Next 2026 (Las Vegas)
4. AWS re:Invent 2025 (Las Vegas)
5. Hack the North 2026 (Waterloo, Canada)
6. JSNation 2026 (Amsterdam)
7. KubeCon + CloudNativeCon EU 2026 (Vienna)
8. Open Source Summit North America 2026 (Austin)

---

## Incomplete Features / TODOs

### ✅ Recently Completed
1. **Backend Integration**
   - ✅ MongoDB database setup with Mongoose
   - ✅ API routes for events (GET all, GET by slug, POST create)
   - ✅ Cloudinary integration for image uploads
   - ✅ Event and Booking models with validation

2. **Dynamic Event Routes**
   - ✅ `app/events/[slug]/page.tsx` created
   - ✅ API integration for fetching event data
   - ⚠️ **Partial**: Only basic structure implemented

### High Priority (In Progress)
3. **Event Detail Page - Full UI** ⚠️
   - Current: Only displays slug and "not found" message
   - Needed: Complete UI matching CSS #event styles
   - Should include:
     - Hero section with event image
     - Title, location, date, time, mode
     - Description and overview
     - Organizer information
     - Agenda section
     - Tags display
     - Booking button (links to booking form)

4. **Event Booking Form**
   - CSS exists (#book-event styles) but no component
   - Backend model ready (`database/booking.model.ts`)
   - Needs:
     - Form component
     - API route for POST /api/bookings
     - Email validation
     - Success/error states

5. **Event Creation Form**
   - Backend API ready (POST /api/events)
   - Needs:
     - Form component with all fields
     - Image upload UI
     - Cloudinary integration on frontend
     - Form validation
     - Success/error handling

### Medium Priority
6. **Navigation Pages**
   - Navbar links are placeholders
   - Need: "Events" page (displays all events from API)
   - Link "Create Event" in Navbar to creation form

7. **Home Page - Database Integration**
   - Currently uses static data from `lib/constants.ts`
   - Should fetch from `/api/events` endpoint
   - Display latest/featured events

8. **Data Migration/Seeding**
   - Migrate 8 static events to MongoDB
   - Create seed script for development

### Nice to Have
9. **Search & Filtering**
   - Filter events by: mode, tags, location, date range
   - Text search across title/description
   - Sort options (date, title, etc.)

10. **Booking Management API**
   - POST /api/bookings (create booking)
   - GET /api/bookings?eventId=xxx (get bookings for event)
   - Email confirmation system

11. **User Authentication**
   - For event creation (restrict to organizers)
   - For managing bookings
   - For favorites/saved events

12. **Environment Configuration**
   - Document required env variables:
     - MONGODB_URI
     - CLOUDINARY_CLOUD_NAME
     - CLOUDINARY_API_KEY
     - CLOUDINARY_API_SECRET
     - NEXT_PUBLIC_BASE_URL

---

## Development Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
```

---

## Configuration Notes

### Path Alias
`@/*` maps to project root (tsconfig.json)

### Next.js Config
Minimal configuration (using defaults) in `next.config.ts`

### ESLint
- Uses ESLint v9 flat config
- Extends Next.js configs (core-web-vitals + TypeScript)

### Environment Variables
Required for production:
```bash
# MongoDB
MONGODB_URI=mongodb+srv://...

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# App URL (for API calls)
NEXT_PUBLIC_BASE_URL=https://your-domain.com
# or http://localhost:3000 for development
```

---

## Git Information
- **Current branch**: main
- **Status**: Modified files
  - `app/events/[slug]/page.tsx` - In progress (partial implementation)
  - `CLAUDE.md` - Documentation updates
- **Recent commits**:
  - c58410d - Rename event page folder to events for consistency
  - 0251b31 - Fix ESLint and TypeScript errors
  - 3d99577 - Fix date formatting in page.tsx
  - 7bd7991 - Add dynamic slug route and API integration ⭐
  - 168cad9 - Refactor date field to Date type and add Cloudinary support
  - d7e7e79 - Add MongoDB database setup with Mongoose models ⭐
  - 12a8f27 - Fix ESLint errors and improve TypeScript type safety

---

## Important Reminders

1. **ALWAYS use path alias `@/`** for imports
2. **ALWAYS use `next/image`** for images (Cloudinary URLs supported)
3. **Mark interactive components** with `"use client"`
4. **MongoDB connection** - use `connectDB()` before database operations
5. **Event detail page** - UI implementation incomplete, only has basic structure
6. **Navbar links** - still placeholders, need routing implementation
7. **Static vs Database data** - `lib/constants.ts` is legacy, API uses MongoDB
8. **Tailwind v4** syntax - check docs if unsure about new features
9. **React 19** - ensure compatibility with new features/patterns
10. **Environment variables** - required for MongoDB, Cloudinary, and base URL
11. **Date handling** - Database uses Date objects, UI displays human-readable strings
12. **Slug generation** - Auto-generated in Mongoose pre-save hook

---

## Visual Identity
- **Primary color**: Teal/cyan (#59deca)
- **Background**: Very dark (#030708)
- **Aesthetic**: Modern, clean, tech-focused
- **Effects**: Glass morphism, gradients, WebGL animations
- **Typography**: Professional with geometric sans-serif

---

*Last updated: 2025-12-17*
*Updated to reflect MongoDB backend, API routes, and event detail page implementation*
