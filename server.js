// server.js
// Minimal Express server that serves a static frontend and exposes two routes:
//   GET /api/health       -> simple JSON so we know the server is up
//   GET /api/random-verse -> returns a random Qur'an verse (arabic + english)

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the frontend from /public
app.use(express.static(path.join(__dirname, "public")));

// Local data source (keeps the project self-contained, no external APIs)
const verses = [
  {
    reference: "1:5",
    arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    english: "It is You we worship and You we ask for help."
  },
  {
    reference: "94:5-6",
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    english: "For indeed, with hardship comes ease. Indeed, with hardship comes ease."
  },
  {
    reference: "2:286",
    arabic: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    english: "Allah does not burden a soul beyond what it can bear."
  },
  {
    reference: "39:53",
    arabic: "قُلْ يَا عِبَادِيَ ٱلَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ ٱللَّهِ",
    english: "Say, “O My servants who have transgressed against themselves, do not despair of the mercy of Allah.”"
  }
];

// Simple “is the backend alive?” route
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Frontend calls this to show a random verse
app.get("/api/random-verse", (_req, res) => {
  const v = verses[Math.floor(Math.random() * verses.length)];
  res.json({ ...v, source: "local-array" });
});

// Root serves the main page
app.get("/", (_req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

// Start server
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
