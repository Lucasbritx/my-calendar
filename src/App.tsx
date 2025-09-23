import React, { useState } from "react";
import "./App.css";
import { processMeetingsData, createTimestampFromISO } from "./utils/dateUtils";
import ScheduleCard from "./components/ScheduleCard";
import DayCard from "./components/DayCard";
import { eachDayOfInterval, endOfMonth, endOfWeek, isSameDay, parseISO, startOfMonth, startOfWeek } from "date-fns";

const meetings = [
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

const processedMeetings = processMeetingsData(meetings);

function App() {
  const [viewMode, setViewMode] = useState<"monthly" | "weekly" | "daily">(
    "weekly"
  );
  const today = new Date();

  let days: Date[] = [];
  if (viewMode === "monthly") {
    days = eachDayOfInterval({
      start: startOfMonth(today),
      end: endOfMonth(today),
    });
  } else if (viewMode === "weekly") {
    days = eachDayOfInterval({
      start: startOfWeek(today, { weekStartsOn: 0 }),
      end: endOfWeek(today, { weekStartsOn: 0 }),
    });
  } else {
    days = [today]; // apenas o dia atual
  }

  const eventsOfDay = (day: Date) =>
    meetings.filter((e) => isSameDay(parseISO(e.startTime), day));

  const toggleViewMode = (newMode: "monthly" | "weekly" | "daily") => {
    setViewMode(newMode);
  };

  const isActive = (mode: "monthly" | "weekly" | "daily") => viewMode === mode;

  return (
    <>
      <h1 className="text-3xl font-bold underline">My Calendar</h1>
      <div className="flex space-x-4 mt-4">
        <button
          className={`px-4 py-2 rounded ${
            isActive("monthly") ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => toggleViewMode("monthly")}
        >
          Monthly View
        </button>
        <button
          className={`px-4 py-2 rounded ${
            isActive("weekly") ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => toggleViewMode("weekly")}
        >
          Weekly View
        </button>
        <button
          className={`px-4 py-2 rounded ${
            isActive("daily") ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => toggleViewMode("daily")}
        >
          Daily View
        </button>
      </div>
      <div className="meetings-container mt-8 grid grid-cols-7 gap-4">
        {processedMeetings.map((meeting) => (
          <ScheduleCard key={meeting.id} meeting={meeting} />
        ))}
        <DayCard schedules={processedMeetings} />
      </div>
    </>
  );
}

export default App;
