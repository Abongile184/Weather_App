// Webpack-specific: require.context scans the folder for .svg files
const req = require.context("../assets/weather-icons", false, /\.svg$/);

// Build a map: { "clear-day": url, "rain": url, ... }
const icons = {};
req.keys().forEach((fileName) => {
  const key = fileName.replace("./", "").replace(".svg", "");
  icons[key] = req(fileName);
});

export function getWeatherIcon(iconName) {
  return icons[iconName] || icons["unknown"]; // fallback if not found
}
