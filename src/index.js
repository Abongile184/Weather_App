import "./Styles/tailwind.css";
import { setupAutocomplete } from './autocompletefeature/autocomplete';
import { updateWeatherUi } from "./ui/updateWeatherUi";
import { showLoader, hideLoader } from "./ui/loader";

//weather api
async function getWeather(location) {
  try {
    showLoader();

    const res = await fetch(
      `http://localhost:3001/api/weather?location=${encodeURIComponent(location)}`
    );
    if (!res.ok) throw new Error("Failed to fetch weather");

    const data = await res.json();

    hideLoader();
    updateWeatherUi(data);
  } catch (err) {
    console.error("Error fetching weather:", err);
    hideLoader();
    document.getElementById("app").innerHTML = `<p class="text-red-500">Could not load weather data.</p>`;
  }
}


document.getElementById("search-button").addEventListener("click", () => {
  const input = document.getElementById("searchInput").value.trim();
  if (input) getWeather(input);
});

//front end for autocomplete feature 
async function getLocationSuggestions(query) {
  const res = await fetch(
    `http://localhost:3001/api/geocode?query=${encodeURIComponent(query)}`
  );

  if (!res.ok) throw new Error("Failed to fetch location suggestions");

  const data = await res.json();

  // Already normalized by backend
  const suggestions = data.map((loc) => ({
  ...loc,
  label: `${loc.name}${loc.state ? ", " + loc.state : ""}, ${loc.country}`,
}));

  console.log("Formatted location suggestions:", suggestions);
  return suggestions;
}

// Initialize autocomplete with dependency injection
setupAutocomplete(getLocationSuggestions);
