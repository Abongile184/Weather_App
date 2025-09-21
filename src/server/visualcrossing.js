import fetch from 'node-fetch';

const baseUrl = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';

export async function fetchWeather(location, startDate, endDate, apiKey, unitGroup = "metric") {
  try {
    const url = `${baseUrl}${encodeURIComponent(location)}/${startDate}/${endDate}?unitGroup=${unitGroup}&key=${apiKey}&contentType=json`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Visual Crossing API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Visual Crossing: Raw data from API:', data); // log API response
    return data;
  } catch (err) {
    console.error("Error fetching weather:", err);
    throw err;
  }
}
