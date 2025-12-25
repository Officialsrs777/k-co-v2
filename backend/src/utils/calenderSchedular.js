import { calendar, calendarId } from "../config/calender.config.js";
import { createZoomMeeting } from "./zoomMeeting.js";
import { DateTime } from "luxon";

export async function scheduleEvent(
  summary,
  description,
  preferredDateTime,
  timezone,
  durationMinutes = 60
) {
  try {
    const startDateTime = new Date(preferredDateTime);
    const endDateTime = new Date(
      startDateTime.getTime() + durationMinutes * 60000
    );

    // 1️⃣ Check free/busy
    const freeBusyResponse = await calendar.freebusy.query({
      requestBody: {
        timeMin: startDateTime.toISOString(),
        timeMax: endDateTime.toISOString(),
        timeZone: timezone,
        items: [{ id: calendarId }],
      },
    });

    const calendarData = freeBusyResponse.data.calendars?.[calendarId];

    if (!calendarData) {
      return {
        success: false,
        message: `Calendar ${calendarId} not found or inaccessible`,
      };
    }

    if ((calendarData.busy || []).length > 0) {
      return { success: false, message: "Preferred slot is busy" };
    }

    // 2️⃣ Create Zoom meeting
    const zoomLink = await createZoomMeeting(
      summary,
      startDateTime.toISOString().replace(".000", ""),
      durationMinutes
    );

    // 3️⃣ Create Google Calendar event
    const event = {
      summary,
      description: `${description}\n\nJoin Zoom: ${zoomLink}`,
      location: zoomLink,
      start: { dateTime: startDateTime.toISOString(), timeZone: timezone },
      end: { dateTime: endDateTime.toISOString(), timeZone: timezone },
    };

    const response = await calendar.events.insert({
      calendarId,
      resource: event,
    });

    return {
      success: true,
      meetingLink: zoomLink,
      event: response.data,
    };
  } catch (error) {
    console.error("Error scheduling meeting:", error);
    return { success: false, message: error.message };
  }
}

export async function getFreeSlots(
  fromISO,
  toISO,
  timezone,
  slotMinutes = 60,
  workStartHour = 10,
  workEndHour = 18
) {
  const fb = await calendar.freebusy.query({
    requestBody: {
      timeMin: fromISO,
      timeMax: toISO,
      timeZone: timezone,
      items: [{ id: calendarId }],
    },
  });

  const busy = fb.data.calendars?.[calendarId]?.busy || [];
  const freeSlots = [];

  let current = DateTime.fromISO(fromISO, { zone: timezone });
  const endRange = DateTime.fromISO(toISO, { zone: timezone });

  while (current < endRange) {
    const day = current.weekday; // 1=Mon ... 7=Sun
    const hour = current.hour;

    // Skip weekends
    if (day === 6 || day === 7) {
      current = current.plus({ days: 1 }).set({
        hour: workStartHour,
        minute: 0,
        second: 0,
      });
      continue;
    }

    // Enforce working hours
    if (hour < workStartHour) {
      current = current.set({
        hour: workStartHour,
        minute: 0,
        second: 0,
      });
    }

    if (hour >= workEndHour) {
      current = current.plus({ days: 1 }).set({
        hour: workStartHour,
        minute: 0,
        second: 0,
      });
      continue;
    }

    const slotStart = current;
    const slotEnd = slotStart.plus({ minutes: slotMinutes });

    if (slotEnd.hour > workEndHour) {
      current = current.plus({ days: 1 }).set({
        hour: workStartHour,
        minute: 0,
        second: 0,
      });
      continue;
    }

    const isBusy = busy.some(b =>
      DateTime.fromISO(b.start) < slotEnd &&
      DateTime.fromISO(b.end) > slotStart
    );

    if (!isBusy) {
      freeSlots.push({
        start: slotStart.toISO(),
        end: slotEnd.toISO(),
      });
    }

    current = slotEnd;
  }

  return freeSlots;
}
