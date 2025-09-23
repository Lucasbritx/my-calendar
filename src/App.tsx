import React, { useState } from "react";
import "./App.css";
import { createTimestampFromISO } from "./utils/dateUtils";
import ScheduleCard from "./components/ScheduleCard";
import DayCard from "./components/DayCard";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import clsx from "clsx";

const IModes = {
  MONTHLY: "monthly",
  WEEKLY: "weekly",
  DAILY: "daily",
} as const;

const MODES: typeof IModes = {
  MONTHLY: "monthly",
  WEEKLY: "weekly",
  DAILY: "daily",
};

const events = [
  {
    id: 1,
    title: "Meeting with Bob",
    startTime: createTimestampFromISO("2024-06-10T10:00:00"), // 10:00 AM
    endTime: createTimestampFromISO("2024-06-10T11:00:00"), // 11:00 AM
  },
  {
    id: 2,
    title: "Lunch with Alice",
    startTime: createTimestampFromISO("2024-06-10T12:30:00"), // 12:30 PM
    endTime: createTimestampFromISO("2024-06-10T13:30:00"), // 1:30 PM
  },
];

function App() {
  const [viewMode, setViewMode] = useState<(typeof MODES)[keyof typeof MODES]>(
    MODES.WEEKLY
  );
  const today = new Date();

  let days: Date[] = [];
  if (viewMode === MODES.MONTHLY) {
    days = eachDayOfInterval({
      start: startOfMonth(today),
      end: endOfMonth(today),
    });
  } else if (viewMode === MODES.WEEKLY) {
    days = eachDayOfInterval({
      start: startOfWeek(today, { weekStartsOn: 0 }),
      end: endOfWeek(today, { weekStartsOn: 0 }),
    });
  } else {
    days = [today]; // apenas o dia atual
  }

  const eventsOfDay = (day: Date) =>
    events.filter((e) => isSameDay(parseISO(String(e.startTime)), day));

  const isActive = (mode: (typeof MODES)[keyof typeof MODES]) =>
    viewMode === mode;

  const viewContainerClass = clsx(
          "gap-2",
          viewMode === MODES.MONTHLY && "grid grid-cols-7",
          viewMode === MODES.WEEKLY && "grid grid-cols-7",
          viewMode === MODES.DAILY && "grid grid-cols-1"
        );

  return (
    <>
      <h1 className="text-3xl font-bold underline">My Calendar</h1>
      <div className="flex space-x-4 mt-4">
        {Object.values(MODES).map((mode) => (
          <button
            key={mode}
            className={`px-4 py-2 rounded ${
              isActive(mode as typeof viewMode)
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setViewMode(mode as typeof viewMode)}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)} View
          </button>
        ))}
      </div>
      <div
        className={viewContainerClass}
      >
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={clsx(
              "border rounded-lg p-2 min-h-[100px] flex flex-col gap-1",
              isSameDay(day, today) && "border-blue-500"
            )}
          >
            <span className="text-sm font-semibold">
              {format(day, "dd/MM")}
            </span>
            <ul className="space-y-1 text-xs">
              {eventsOfDay(day).map((event) => (
                <li
                  key={event.id}
                  className="px-2 py-1 rounded bg-blue-100 text-blue-700"
                >
                  {event.title}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
