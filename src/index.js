import "./Styles/tailwind.css";
import { setupAutocomplete } from "./autocompletefeature/autocomplete";
import { updateWeatherUi } from "./ui/updateWeatherUi";
import { showLoader, hideLoader } from "./ui/loader";

const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

// 🔑 Base URL: use localhost in dev, Render in production
const API_BASE = isLocal
  ? "http://localhost:3001"
  : "https://weather-app-br38.onrender.com";


// ===== Weather API =====
async function getWeather(location) {
  try {
    showLoader();

    const res = await fetch(
      `${API_BASE}/api/weather?location=${encodeURIComponent(location)}`
    );
    if (!res.ok) throw new Error("Failed to fetch weather");

    const data = await res.json();

    hideLoader();
    updateWeatherUi(data);
  } catch (err) {
    console.error("Error fetching weather:", err);
    hideLoader();
    document.getElementById("app").innerHTML =
      `<p class="text-red-500">Could not load weather data.</p>`;
  }
}

// ===== Geocoding / Autocomplete API =====
async function getLocationSuggestions(query) {
  try {
    const res = await fetch(
      `${API_BASE}/api/geocode?query=${encodeURIComponent(query)}`
    );
    if (!res.ok) throw new Error("Failed to fetch location suggestions");

    const data = await res.json();

    // Normalize with label
    return data.map((loc) => ({
      ...loc,
      label: `${loc.name}${loc.state ? ", " + loc.state : ""}, ${loc.country}`,
    }));
  } catch (err) {
    console.error("Error fetching location suggestions:", err);
    return [];
  }
}

// ===== Event Listeners =====
document.getElementById("search-button").addEventListener("click", () => {
  const input = document.getElementById("searchInput").value.trim();
  if (input) getWeather(input);
});

// Initialize autocomplete with dependency injection
setupAutocomplete(getLocationSuggestions);
