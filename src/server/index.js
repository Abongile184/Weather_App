import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fetchWeather } from "./visualcrossing.js";
import { fetchGeocoding } from "./geocoding.js";

// Load .env only in local dev (not on Render)
if (process.env.RENDER !== "true") {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// ===== Weather API =====
app.get("/api/weather", async (req, res) => {
  const { location } = req.query;
  if (!location) return res.status(400).json({ error: "Location is required" });

  try {
    const today = new Date().toISOString().split("T")[0];
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    const endDateStr = endDate.toISOString().split("T")[0];

    const weatherData = await fetchWeather(
      location,
      today,
      endDateStr,
      process.env.VISUAL_CROSSING_API_KEY
    );

    res.json(weatherData);
  } catch (err) {
    console.error("Weather API error:", err.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// ===== Geocoding API =====
app.get("/api/geocode", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Query is required" });

  try {
    const results = await fetchGeocoding(query, process.env.GEOAPIFY_API_KEY);
    res.json(results);
  } catch (err) {
    console.error("Geocoding API error:", err.message);
    res.status(500).json({ error: "Failed to fetch geocoding data" });
  }
});

// ===== Diagnostics =====
console.log(
  "VC API:",
  process.env.VISUAL_CROSSING_API_KEY ? "✅ Loaded" : "❌ Missing"
);
console.log(
  "Geo API:",
  process.env.GEOAPIFY_API_KEY ? "✅ Loaded" : "❌ Missing"
);

app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
