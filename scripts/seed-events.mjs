import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local or .env
let envLoaded = false;
for (const envFile of ['.env.local', '.env']) {
    try {
        const envPath = join(__dirname, '..', envFile);
        const envContent = readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith('#')) {
                const [key, ...valueParts] = trimmedLine.split('=');
                if (key && valueParts.length > 0) {
                    const value = valueParts.join('=').trim();
                    process.env[key.trim()] = value;
                }
            }
        });
        console.log(`Loaded environment from ${envFile}`);
        envLoaded = true;
        break;
    } catch (error) {
        // Try next file
    }
}
if (!envLoaded) {
    console.log('Note: Could not load .env file. Using system environment variables.');
}

// Event schema (must match database/event.model.ts)
const EventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, unique: true, index: true },
        description: { type: String, required: true, trim: true },
        overview: { type: String, required: true, trim: true },
        venue: { type: String, required: true, trim: true },
        location: { type: String, required: true, trim: true },
        date: { type: Date, required: true },
        time: { type: String, required: true },
        timezone: { type: String, required: true, trim: true },
        startAtUtc: { type: Date, required: true },
        mode: {
            type: String,
            required: true,
            enum: ["online", "offline", "hybrid"],
        },
        audience: { type: String, required: true, trim: true },
        agenda: {
            type: [String],
            required: true,
            validate: {
                validator: (v) =>
                    Array.isArray(v) &&
                    v.length > 0 &&
                    v.every((item) => typeof item === "string" && item.trim().length > 0),
                message: "Agenda must have at least one item",
            },
        },
        organizer: { type: String, required: true, trim: true },
        tags: {
            type: [String],
            required: true,
            validate: {
                validator: (v) =>
                    Array.isArray(v) &&
                    v.length > 0 &&
                    v.every((item) => typeof item === "string" && item.trim().length > 0),
                message: "Tags must have at least one item",
            },
        },
    },
    { timestamps: true }
);

// Slug generation pre-save hook
EventSchema.pre("save", function () {
    const event = this;

    // Normalize date
    if (event.isModified("date") || event.isNew) {
        const date = new Date(event.date);
        if (isNaN(date.getTime())) {
            throw new Error("Invalid date format");
        }
        date.setUTCHours(0, 0, 0, 0);
        event.date = date;
    }

    // Generate slug
    if (event.isModified("title") || event.isModified("date") || event.isNew) {
        const titleSlug = event.title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

        const dateStr = event.date.toISOString().split('T')[0];
        event.slug = `${titleSlug}-${dateStr}`;
    }
});

const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);

// Sample events data
const sampleEvents = [
    {
        title: "React Summit 2026",
        description: "The biggest React conference of the year featuring the latest innovations in React ecosystem",
        overview: "Join thousands of React developers from around the world for two days of cutting-edge talks, workshops, and networking. Learn about React Server Components, Suspense, and the future of React from core team members and community leaders.",
        venue: "RAI Amsterdam Convention Centre",
        location: "Amsterdam, Netherlands",
        date: "2026-06-10",
        time: "09:00",
        timezone: "Europe/Amsterdam",
        mode: "hybrid",
        audience: "React developers, Frontend engineers, Full-stack developers",
        agenda: [
            "09:00 AM | Registration and Coffee",
            "10:00 AM | Opening Keynote - The Future of React",
            "11:30 AM | React Server Components Deep Dive",
            "01:00 PM | Lunch Break",
            "02:00 PM | Workshop: Building with Next.js 15",
            "04:00 PM | Panel Discussion: State Management in 2026",
            "05:30 PM | Networking Reception"
        ],
        organizer: "GitNation",
        tags: ["React", "JavaScript", "Web Development", "Frontend", "Conference"]
    },
    {
        title: "Next.js Conf 2025",
        description: "The official Next.js conference showcasing the latest features and best practices",
        overview: "Discover what's new in Next.js 15 and beyond. Learn from the Vercel team and community experts about App Router, Server Actions, and modern web development patterns. Network with fellow Next.js developers and share experiences.",
        venue: "Moscone Center",
        location: "San Francisco, USA",
        date: "2025-10-24",
        time: "10:00",
        timezone: "America/Los_Angeles",
        mode: "hybrid",
        audience: "Web developers, Full-stack engineers, Tech leads",
        agenda: [
            "10:00 AM | Welcome & Registration",
            "11:00 AM | Keynote: Next.js 15 and Beyond",
            "12:30 PM | Lunch and Networking",
            "02:00 PM | Deep Dive: Server Components & Actions",
            "03:30 PM | Workshop: Optimizing Next.js Performance",
            "05:00 PM | Q&A with Next.js Team",
            "06:00 PM | After Party"
        ],
        organizer: "Vercel",
        tags: ["Next.js", "React", "Web Development", "Vercel", "Conference"]
    },
    {
        title: "AWS re:Invent 2025",
        description: "Amazon's flagship cloud computing conference with hundreds of sessions and hands-on labs",
        overview: "The world's largest cloud computing event bringing together the global cloud community. Explore the latest AWS services, learn best practices, get hands-on with new technologies, and network with cloud professionals from around the world.",
        venue: "The Venetian Convention Center",
        location: "Las Vegas, USA",
        date: "2025-11-30",
        time: "08:00",
        timezone: "America/Los_Angeles",
        mode: "offline",
        audience: "Cloud architects, DevOps engineers, Developers, IT professionals",
        agenda: [
            "08:00 AM | Registration Opens",
            "09:00 AM | CEO Keynote",
            "11:00 AM | Technical Sessions Begin",
            "12:00 PM | Expo Hall Opens",
            "01:00 PM | Lunch Break",
            "02:00 PM | Hands-on Labs",
            "05:00 PM | Networking Events",
            "07:00 PM | re:Play Party"
        ],
        organizer: "Amazon Web Services",
        tags: ["AWS", "Cloud", "DevOps", "Infrastructure", "Conference"]
    },
    {
        title: "Hack the North 2026",
        description: "Canada's biggest hackathon bringing together 1000+ hackers for 36 hours of creation",
        overview: "Canada's premier hackathon hosted at the University of Waterloo. Build amazing projects, learn from industry mentors, attend workshops, and compete for prizes. Whether you're a beginner or experienced hacker, this is your chance to innovate.",
        venue: "University of Waterloo Engineering Campus",
        location: "Waterloo, Canada",
        date: "2026-09-18",
        time: "18:00",
        timezone: "America/Toronto",
        mode: "offline",
        audience: "Students, Developers, Designers, Entrepreneurs",
        agenda: [
            "06:00 PM | Check-in & Dinner",
            "07:00 PM | Opening Ceremony",
            "08:00 PM | Hacking Begins",
            "09:00 PM | Workshops Start",
            "12:00 AM | Midnight Snack",
            "08:00 AM | Breakfast (Day 2)",
            "02:00 PM | Hacking Ends",
            "03:00 PM | Project Demos",
            "06:00 PM | Closing Ceremony & Awards"
        ],
        organizer: "Hack the North Team",
        tags: ["Hackathon", "Student", "Innovation", "Coding", "Competition"]
    },
    {
        title: "JSNation 2026",
        description: "The ultimate JavaScript conference covering all aspects of the JS ecosystem",
        overview: "A two-day conference dedicated to JavaScript and Node.js. Explore frontend frameworks, backend technologies, tooling, and best practices. Learn from international speakers and connect with JavaScript enthusiasts from around the world.",
        venue: "AFAS Live",
        location: "Amsterdam, Netherlands",
        date: "2026-06-03",
        time: "09:00",
        timezone: "Europe/Amsterdam",
        mode: "hybrid",
        audience: "JavaScript developers, Node.js developers, Full-stack engineers",
        agenda: [
            "09:00 AM | Registration & Coffee",
            "10:00 AM | Opening Keynote",
            "11:00 AM | Modern JavaScript Patterns",
            "12:30 PM | Lunch",
            "02:00 PM | Node.js Performance Tips",
            "03:30 PM | TypeScript Deep Dive",
            "05:00 PM | Future of JavaScript Panel",
            "06:00 PM | Networking Drinks"
        ],
        organizer: "GitNation",
        tags: ["JavaScript", "Node.js", "TypeScript", "Web Development", "Conference"]
    },
    {
        title: "KubeCon + CloudNativeCon EU 2026",
        description: "The premier Kubernetes and cloud native conference in Europe",
        overview: "Join the cloud native community for the flagship conference of the Cloud Native Computing Foundation. Learn about Kubernetes, containers, microservices, and cloud native technologies from maintainers, end users, and ecosystem leaders.",
        venue: "Messe Wien Exhibition & Congress Center",
        location: "Vienna, Austria",
        date: "2026-03-17",
        time: "09:00",
        timezone: "Europe/Vienna",
        mode: "hybrid",
        audience: "DevOps engineers, SREs, Platform engineers, Cloud architects",
        agenda: [
            "09:00 AM | Registration",
            "10:00 AM | Welcome & Keynotes",
            "12:00 PM | Breakout Sessions Begin",
            "01:00 PM | Lunch & Expo",
            "02:30 PM | Technical Deep Dives",
            "04:00 PM | Hands-on Tutorials",
            "05:30 PM | Solutions Showcase",
            "07:00 PM | Community Reception"
        ],
        organizer: "Cloud Native Computing Foundation (CNCF)",
        tags: ["Kubernetes", "Cloud Native", "DevOps", "Containers", "Conference"]
    },
    {
        title: "Open Source Summit North America 2026",
        description: "The premier conference for open source developers, technologists, and community leaders",
        overview: "Explore the latest in open source technologies, from AI/ML to cloud infrastructure. Connect with maintainers, contributors, and users of open source projects. Learn best practices for building and sustaining open source communities.",
        venue: "Austin Convention Center",
        location: "Austin, USA",
        date: "2026-04-13",
        time: "08:30",
        timezone: "America/Chicago",
        mode: "hybrid",
        audience: "Open source developers, Maintainers, Community managers, Tech leaders",
        agenda: [
            "08:30 AM | Registration & Breakfast",
            "09:30 AM | Opening Keynote",
            "11:00 AM | Track Sessions Begin",
            "12:30 PM | Lunch Break",
            "02:00 PM | Workshops & BOFs",
            "04:00 PM | Lightning Talks",
            "05:30 PM | Expo Hall Reception",
            "07:00 PM | Evening Events"
        ],
        organizer: "The Linux Foundation",
        tags: ["Open Source", "Linux", "Community", "Development", "Conference"]
    },
    {
        title: "Google Cloud Next 2026",
        description: "Google's premier cloud computing event featuring product announcements and hands-on learning",
        overview: "Discover the latest in Google Cloud Platform, AI/ML innovations, and enterprise solutions. Get hands-on with new products, learn from Google experts and customers, and network with cloud professionals from around the globe.",
        venue: "Mandalay Bay Convention Center",
        location: "Las Vegas, USA",
        date: "2026-04-06",
        time: "09:00",
        timezone: "America/Los_Angeles",
        mode: "hybrid",
        audience: "Cloud developers, Data scientists, Enterprise architects, IT decision makers",
        agenda: [
            "09:00 AM | Doors Open",
            "10:00 AM | CEO Keynote",
            "12:00 PM | Developer Keynote",
            "01:00 PM | Lunch & Networking",
            "02:00 PM | Breakout Sessions",
            "04:00 PM | Hands-on Labs",
            "06:00 PM | Demo Showcases",
            "07:00 PM | After Hours Celebration"
        ],
        organizer: "Google Cloud",
        tags: ["Google Cloud", "GCP", "Cloud", "AI/ML", "Conference"]
    }
];

// Helper to create startAtUtc from date, time, and timezone
function createStartAtUtc(dateStr, timeStr, tz) {
    // Parse the date and time in the specified timezone
    const dateTimeParts = timeStr.split(':');
    const hour = parseInt(dateTimeParts[0], 10);
    const minute = parseInt(dateTimeParts[1], 10);

    const dateParts = dateStr.split('-');
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // months are 0-indexed
    const day = parseInt(dateParts[2], 10);

    // Create date in UTC (we'll handle timezone offset manually for simplicity)
    // For production, you'd use a library like dayjs with timezone plugin
    const date = new Date(Date.UTC(year, month, day, hour, minute, 0, 0));

    return date;
}

// Helper to generate slug from title and date
function generateSlug(title, dateStr) {
    const titleSlug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    return `${titleSlug}-${dateStr}`;
}

async function seedDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB successfully');

        console.log('Clearing existing events...');
        await Event.deleteMany({});
        console.log('Existing events cleared');

        console.log('Creating new events...');

        // Process each event to add startAtUtc and slug
        const eventsWithStartAt = sampleEvents.map(event => ({
            ...event,
            slug: generateSlug(event.title, event.date),
            startAtUtc: createStartAtUtc(event.date, event.time, event.timezone)
        }));

        const createdEvents = await Event.insertMany(eventsWithStartAt);

        console.log(`\n✅ Successfully seeded ${createdEvents.length} events to the database!\n`);

        // Display created events
        createdEvents.forEach((event, index) => {
            console.log(`${index + 1}. ${event.title}`);
            console.log(`   Slug: ${event.slug}`);
            console.log(`   Date: ${event.date.toISOString()}`);
            console.log(`   StartAtUtc: ${event.startAtUtc.toISOString()}`);
            console.log('');
        });

        await mongoose.connection.close();
        console.log('Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

seedDatabase();
