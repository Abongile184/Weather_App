import fetch from "node-fetch";

const baseUrl = "https://api.geoapify.com/v1/geocode/autocomplete";

export async function fetchGeocoding(query, apiKey) {
  try {
    const url = `${baseUrl}?text=${encodeURIComponent(query)}&limit=5&apiKey=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data)

    // Extract only what you need (formatted place + lat/lon)
    return data.features.map((item) => ({
      name: item.properties.city || item.properties.name || item.properties.formatted,
      state: item.properties.state || "",
      country: item.properties.country || "",
      lat: item.properties.lat,
      lon: item.properties.lon,
}));
  } catch (err) {
    console.error("Error fetching geocoding:", err);
    throw err;
  }
}
