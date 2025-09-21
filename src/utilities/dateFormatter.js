import { DateTime } from "luxon"; 
export function formatDateTime(dateStr, timezone) {
  // Visual Crossing sometimes gives "YYYY-MM-DD" or full ISO
  const dt = DateTime.fromISO(dateStr, { zone: timezone });

  // Format: 17 September 2025
  const formattedDate = dt.setZone(timezone).toFormat("dd LLLL yyyy");

  // Format: 14:32 (24-hour clock)
  const formattedTime = DateTime.now().setZone(timezone).toFormat("HH:mm");

  return { formattedDate, formattedTime };
}

//installed luxom then  imported Datetime, this function wil allow me to retrieve hourly updates from current time now and onwards  
export function getUpcomingHours(today, timezone, count = 6) {
  const now = DateTime.now().setZone(timezone);

  return today.hours
    .map(hour => {
      const dt = DateTime.fromISO(hour.datetime, { zone: timezone });
      return { ...hour, datetime: dt.toFormat("HH:mm"), epoch: dt.toSeconds() };
    })
    .filter(hour => hour.epoch >= now.toSeconds()) // only future hours
    .slice(0, count); // limit to `count`
}

export function formatDayName(datetime, timezone) {
  const date = DateTime.fromISO(datetime, { zone: timezone });
  const today = DateTime.now().setZone(timezone).startOf("day");
  const diff = date.startOf("day").diff(today, "days").days;

  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return date.toFormat("ccc"); // Short weekday: Mon, Tue, Wed
}

/**
 * Format date as "Jul 29"
 */
export function formatDate(datetime, timezone) {
  const date = DateTime.fromISO(datetime, { zone: timezone });
  return date.toFormat("MMM d"); // Example: Jul 29
}

