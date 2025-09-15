import React, { useState } from "react";

import "./App.css";
import {
  processMeetingsData,
  formatFullDateTime,
  createTimestampFromISO,
} from "./utils/dateUtils";
import ScheduleCard from "./components/ScheduleCard";

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
  return (
    <>
      <h1 className="text-3xl font-bold underline">My Calendar</h1>
      <div className="meetings-container mt-8 grid grid-cols-7 gap-4">
        {processedMeetings.map((meeting) => (
          <ScheduleCard key={meeting.id} meeting={meeting} />
        ))}
      </div>
    </>
  );
}

export default App;
