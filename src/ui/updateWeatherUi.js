import { cToF, fToC } from "../utilities/unitConversion";
import { getWeatherIcon } from "../utilities/iconMapper.js";
import { formatDateTime,  getUpcomingHours, formatDayName, formatDate } from "../utilities/dateFormatter.js";

export function updateWeatherUi(data) {
  const app = document.getElementById("app");

  if (!data || !data.days || !data.days.length) {
    app.innerHTML = "<p class='text-red-500'>No weather data found.</p>";
    return;
  }

  const today = data.days[0];
  let currentUnit = "C"; // default Celsius
  const { formattedDate, formattedTime } = formatDateTime(today.datetime, data.timezone);


  function render(tempUnit = "C") {
    const temp = tempUnit === "C" ? today.temp : cToF(today.temp); //to switch between F | C temp
    const hourly = getUpcomingHours(today, data.timezone, 6);

    app.innerHTML = `
  <div class="flex flex-col items-center space-y-10 w-full">
    <!-- Today’s Weather Card -->
    <div class="w-full max-w-4xl shadow-lg px-8 py-8 bg-white rounded-2xl">
      <div class="flex flex-col items-start mb-16">
        <p class="text-4xl font-bold text-gray-700">${data.address}</p>
        <p class="text-xl font-normal text-gray-500 mt-1">${formattedDate} — ${formattedTime}</p>
        <p class="text-xl font-normal text-gray-500 mt-1">${today.conditions}</p>
      </div>

      <div class="flex mb-10 items-center">
        <div class="w-2/4 flex items-center">
          <div class="flex-shrink-0 mr-6">
            <img src="${getWeatherIcon(today.icon)}" class="w-28 h-28" alt="${today.icon}">
          </div>
          <div class="text-7xl font-light text-gray-900 relative">
            ${temp}
            <sup class="text-lg absolute top-0 left-full ml-1">
              <span id="unit-c" class="cursor-pointer ${tempUnit === "C" ? "font-bold text-gray-900" : "text-gray-500"}">°C</span> |
              <span id="unit-f" class="cursor-pointer ${tempUnit === "F" ? "font-bold text-gray-900" : "text-gray-500"}">°F</span>
            </sup>
          </div>
        </div>

        <div class="w-2/4 pl-8 border-l border-gray-200">
          <div class="mb-8">
            <p class="text-lg text-gray-600 font-medium">Precipitation: <span class="font-semibold text-gray-800">${today.precip} mm</span></p>
            <p class="text-lg text-gray-600 font-medium">Humidity: <span class="font-semibold text-gray-800">${today.humidity}%</span></p>
            <p class="text-lg text-gray-600 font-medium">Wind: <span class="font-semibold text-gray-800">${today.windspeed} km/h</span></p>
          </div>
        </div>
      </div>

      <!-- Hourly forecast -->
      <div class="flex justify-between items-center text-center mt-8 overflow-x-auto">
        ${hourly.map(hour => `
          <div class="flex flex-col items-center px-2">
            <p class="text-sm text-gray-500">${hour.datetime}</p>
            <img src="${getWeatherIcon(hour.icon)}" class="w-10 h-10 my-2" alt="${hour.icon}">
            <p class="text-lg font-semibold">${tempUnit === "C" ? hour.temp : cToF(hour.temp)}°</p>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Weekly Forecast (7 scrollable cards in a row) -->
<div class="w-full overflow-x-auto">
  <div class="flex space-x-6 px-2">
    ${data.days.slice(1, 8).map((day, i) => `
      <div class="w-64 flex-shrink-0 cursor-pointer border border-gray-300 rounded flex flex-col justify-center items-center text-center p-6 bg-white shadow-md">
        <div class="text-md font-bold flex flex-col text-gray-900">
          <span class="uppercase">${i === 0 ? "Tomorrow" : formatDayName(day.datetime, data.timezone)}</span>
          <span class="font-normal text-gray-700 text-sm">${formatDate(day.datetime, data.timezone)}</span>
        </div>
        <div class="w-32 h-32 flex items-center justify-center">
          <img src="${getWeatherIcon(day.icon)}" class="h-20" alt="${day.icon}">
        </div>
        <p class="text-gray-700 mb-2">${day.conditions}</p>
        <div class="text-3xl font-bold text-gray-900 mb-6">
          ${tempUnit === "C" ? day.tempmax : cToF(day.tempmax)}º
          <span class="font-normal text-gray-700 mx-1">/</span>
          ${tempUnit === "C" ? day.tempmin : cToF(day.tempmin)}º
        </div>
        <div class="flex justify-between w-full">
          <div class="flex items-center text-gray-700 px-2 text-sm">
            💧 ${day.precip} mm
          </div>
          <div class="flex items-center text-gray-700 px-2 text-sm">
            🌬️ ${day.windspeed} km/h
          </div>
        </div>
      </div>
    `).join("")}
  </div>
</div>
`;
    // Re-attach toggle listeners
    document.getElementById("unit-c").addEventListener("click", () => {
      if (currentUnit !== "C") {
        currentUnit = "C";
        render("C");
      }
    });
    document.getElementById("unit-f").addEventListener("click", () => {
      if (currentUnit !== "F") {
        currentUnit = "F";
        render("F");
      }
    });
  }

  // Initial render in Celsius
  render("C");
}