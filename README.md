<div align="center">

# DevEvent

### 🎯 *The Hub for Every Dev Event You Can't Miss*

Discover hackathons, conferences, and meetups worldwide with WebGL-powered UI

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

<br/>

<a href="https://nextjs-delta-mocha-ywt9alcjpn.vercel.app" style="text-decoration: none;"><strong>🚀 Live Demo</strong></a> • <a href="https://github.com/Thir13een/dev-event-app" style="text-decoration: none;"><strong>⭐ Star Us</strong></a>

<br/>

</div>

---

## ✨ Features

<div align="center">

| 🎪 **Events** | 🚀 **Tech** | 🎨 **Design** |
|:---:|:---:|:---:|
| Browse & Filter | ISR Caching (60s) | WebGL Animations |
| Create Events | MongoDB Direct Queries | Glass Morphism |
| Book with Email | TypeScript Strict | Dark Mode |
| Timezone Support | Server Components | Mobile First |
| Tag Search | Zero Build Errors | Responsive Grid |

</div>

---

## 🚀 Quick Start

```bash
# 1️⃣ Clone & Install
git clone https://github.com/Thir13een/dev-event-app.git
cd dev-event-app
npm install

# 2️⃣ Set Environment Variable
echo "MONGODB_URI=your_mongodb_uri" > .env

# 3️⃣ Run
npm run dev
# Open http://localhost:3000
```

<details>
<summary><b>📖 Need MongoDB URI?</b></summary>

**Free MongoDB Atlas:**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster (M0)
3. Get connection string
4. Add to `.env`

**Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/devevent
```

</details>

---

## 🛠️ Tech Stack

<div align="center">

### Frontend
![Next.js](https://img.shields.io/badge/-Next.js-000?style=flat&logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) ![Tailwind](https://img.shields.io/badge/-Tailwind-06B6D4?style=flat&logo=tailwindcss&logoColor=white) ![OGL](https://img.shields.io/badge/-OGL-FF6B6B?style=flat&logoColor=white)

### Backend
![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) ![Mongoose](https://img.shields.io/badge/-Mongoose-880000?style=flat&logoColor=white) ![Dayjs](https://img.shields.io/badge/-Dayjs-FF5F5F?style=flat&logoColor=white)

</div>

---

## 📁 Structure

```
app/
├── api/                    # REST API routes
│   ├── events/             # GET, POST events
│   └── bookings/           # POST bookings
├── events/                 # Event pages (ISR cached)
├── create-event/           # Event creation
└── page.tsx                # Home (featured events)

components/
├── EventCard.tsx           # Event display
├── EventsListWithFilters.tsx  # Search & filter
├── BookingForm.tsx         # Booking UI
└── LightRays.tsx           # WebGL background

database/
├── event.model.ts          # Event schema
└── booking.model.ts        # Booking schema

lib/
├── mongodb.ts              # Cached DB connection
├── queries.ts              # Direct DB queries
└── utils.ts                # Date/timezone helpers
```

---

## 🔌 API

<table>
<tr><th>Endpoint</th><th>Method</th><th>Description</th></tr>
<tr><td><code>/api/events</code></td><td>GET</td><td>List events (?limit, ?page)</td></tr>
<tr><td><code>/api/events/[slug]</code></td><td>GET</td><td>Get single event</td></tr>
<tr><td><code>/api/events</code></td><td>POST</td><td>Create event</td></tr>
<tr><td><code>/api/bookings</code></td><td>POST</td><td>Book event</td></tr>
</table>

<details>
<summary><b>📋 Example: Create Event</b></summary>

```json
{
  "title": "React Summit 2026",
  "description": "React conference",
  "overview": "Full details...",
  "venue": "Amsterdam RAI",
  "location": "Amsterdam, Netherlands",
  "date": "2026-06-10",
  "time": "09:00",
  "timezone": "Europe/Amsterdam",
  "mode": "hybrid",
  "audience": "Developers",
  "agenda": ["09:00 | Registration"],
  "organizer": "GitNation",
  "tags": ["React", "JavaScript"]
}
```

</details>

---

## ⚡ Performance

<div align="center">

| Feature | Benefit |
|---------|---------|
| 🚀 **ISR Caching** | Pages regenerate every 60s |
| 🗄️ **Direct DB Queries** | No HTTP fetch during build |
| 🌍 **Timezone Smart** | Auto-convert to local time |
| 📊 **Static Pages** | SEO-friendly, lightning fast |
| ♻️ **Cached Connections** | Serverless optimized |

</div>

---

## 🚢 Deploy to Vercel

<div align="center">

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Thir13een/dev-event-app)

**Or manually:**
1. Push to GitHub
2. Import to Vercel
3. Add `MONGODB_URI` env variable
4. Deploy! 🎉

</div>

---

## 🎨 Design System

<div align="center">

**Colors:** 🔷 `#59deca` (Primary) • ⬛ `#030708` (BG) • ⬜ `#fcfcfd` (Text)

**Fonts:** Schibsted Grotesk (UI) • Martian Mono (Code)

**Effects:** Glass Morphism • WebGL Rays • Text Gradients

</div>

---

## 🧪 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production
npm run lint         # ESLint check

# Database maintenance
node scripts/dedupe-bookings.mjs        # Preview duplicates
node scripts/dedupe-bookings.mjs --apply  # Delete duplicates
```

---

## 🤝 Contributing

<div align="center">

**We ❤️ contributions!**

Fork → Create Branch → Commit → Push → PR

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](http://makeapullrequest.com)
[![Issues](https://img.shields.io/github/issues/Thir13een/dev-event-app?style=flat)](https://github.com/Thir13een/dev-event-app/issues)

</div>

---

## 💖 Credits

<div align="center">

Built with: [Next.js](https://nextjs.org/) • [React](https://react.dev/) • [TypeScript](https://www.typescriptlang.org/) • [MongoDB](https://www.mongodb.com/) • [Tailwind CSS](https://tailwindcss.com/)

Special thanks: [OGL](https://github.com/oframe/ogl) • [Lucide](https://lucide.dev/) • [Dayjs](https://day.js.org/)

</div>

---

<div align="center">

### Made with ❤️ for the Developer Community

**DevEvent** • Connecting devs worldwide

<br/>

[![GitHub Stars](https://img.shields.io/github/stars/Thir13een/dev-event-app?style=social)](https://github.com/Thir13een/dev-event-app)

<a href="#devevent" style="text-decoration: none;"><strong>⬆ Back to Top</strong></a>

</div>
