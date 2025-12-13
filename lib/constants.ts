// Centralized event constants for use across the app
// Images should reference assets under public/images

export type Event = {
  title: string;
  image: string; // path under /public, e.g. "/images/event1.png"
  slug: string;
  location: string;
  date: string; // human-readable date, used directly in UI
  time: string; // human-readable time range
};

export const events: Event[] = [
  {
    title: "React Summit 2026",
    image: "/images/event1.png",
    slug: "react-summit-2026",
    location: "Amsterdam, NL",
    date: "June 12, 2026",
    time: "09:00 – 18:00 CEST",
  },
  {
    title: "Next.js Conf 2025",
    image: "/images/event2.png",
    slug: "nextjs-conf-2025",
    location: "San Francisco, USA (Hybrid)",
    date: "December 15, 2025",
    time: "10:00 – 17:00 PST",
  },
  {
    title: "Google Cloud Next 2026",
    image: "/images/event3.png",
    slug: "google-cloud-next-2026",
    location: "Las Vegas, USA",
    date: "April 7–9, 2026",
    time: "09:00 – 17:30 PDT",
  },
  {
    title: "AWS re:Invent 2025",
    image: "/images/event4.png",
    slug: "aws-reinvent-2025",
    location: "Las Vegas, USA",
    date: "November 30 – December 5, 2025",
    time: "08:30 – 18:00 PST",
  },
  {
    title: "Hack the North 2026",
    image: "/images/event5.png",
    slug: "hack-the-north-2026",
    location: "Waterloo, Canada",
    date: "September 18–20, 2026",
    time: "All weekend (Hackathon)",
  },
  {
    title: "JSNation 2026",
    image: "/images/event6.png",
    slug: "jsnation-2026",
    location: "Amsterdam, NL",
    date: "June 11, 2026",
    time: "09:30 – 18:00 CEST",
  },
  {
    title: "KubeCon + CloudNativeCon EU 2026",
    image: "/images/event-full.png",
    slug: "kubecon-cloudnativecon-eu-2026",
    location: "Vienna, Austria",
    date: "March 4–6, 2026",
    time: "09:00 – 18:00 CET",
  },
  {
    title: "Open Source Summit North America 2026",
    image: "/images/event2.png",
    slug: "open-source-summit-na-2026",
    location: "Austin, USA",
    date: "May 12–14, 2026",
    time: "09:00 – 18:00 CDT",
  },
];

export default events;