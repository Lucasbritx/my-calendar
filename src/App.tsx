import React, { useState } from "react";
import "./App.css";
import { createTimestampFromISO } from "./utils/dateUtils";
import DayCard from "./components/DayCard";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import clsx from "clsx";
import { MODES } from "./constants/modes";

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
  {
    id: 3,
    title: "Project Review",
    startTime: createTimestampFromISO("2024-06-11T14:00:00"), // 2:00 PM
    endTime: createTimestampFromISO("2024-06-11T15:00:00"), // 3:00 PM
  },
  {
    id: 4,
    title: "Dentist Appointment",
    startTime: createTimestampFromISO("2024-06-15T09:00:00"), // 9:00 AM
    endTime: createTimestampFromISO("2024-06-15T10:00:00"), // 10:00 AM
  },
  {
    id: 5,
    title: "Team Meeting",
    startTime: createTimestampFromISO("2024-06-18T11:00:00"), // 11:00 AM
    endTime: createTimestampFromISO("2024-06-18T12:00:00"), // 12:00 PM
  },
  // create two events for today
   {
    id: 60,
    title: "Conflicting meeting",
    startTime: createTimestampFromISO(
      format(new Date(), "yyyy-MM-dd'T'09:15:00")
    ), // today at 9:00 AM
    endTime: createTimestampFromISO(
      format(new Date(), "yyyy-MM-dd'T'10:30:00")
    ), // today at 10:00 AM
  },
  {
    id: 6,
    title: "Code Review",
    startTime: createTimestampFromISO(
      format(new Date(), "yyyy-MM-dd'T'09:00:00")
    ), // today at 9:00 AM
    endTime: createTimestampFromISO(
      format(new Date(), "yyyy-MM-dd'T'10:00:00")
    ), // today at 10:00 AM
  },
  {
    id: 7,
    title: "Client Call",
    startTime: createTimestampFromISO(
      format(new Date(), "yyyy-MM-dd'T'15:00:00")
    ), // today at 3:00 PM
    endTime: createTimestampFromISO(
      format(new Date(), "yyyy-MM-dd'T'16:00:00")
    ), // today at 4:00 PM
  },
  // create events for tomorrw
  {
    id: 8,
    title: "Marketing Meeting",
    startTime: createTimestampFromISO(
      format(
        new Date(new Date().setDate(new Date().getDate() + 1)),
        "yyyy-MM-dd'T'10:00:00"
      )
    ), // tomorrow at 10:00 AM
    endTime: createTimestampFromISO(
      format(
        new Date(new Date().setDate(new Date().getDate() + 1)),
        "yyyy-MM-dd'T'23:00:00"
      )
    ), // tomorrow at 11:00 AM
  },
  {
    id: 9,
    title: "Product Launch",
    startTime: createTimestampFromISO(
      format(
        new Date(new Date().setDate(new Date().getDate() + 1)),
        "yyyy-MM-dd'T'14:00:00"
      )
    ), // tomorrow at 2:00 PM
    endTime: createTimestampFromISO(
      format(
        new Date(new Date().setDate(new Date().getDate() + 1)),
        "yyyy-MM-dd'T'15:00:00"
      )
    ), // tomorrow at 3:00 PM
  },
  // create events for two days ago
  {
    id: 10,
    title: "Sprint Planning",
    startTime: createTimestampFromISO(
      format(
        new Date(new Date().setDate(new Date().getDate() - 2)),
        "yyyy-MM-dd'T'09:00:00"
      )
    ), // two days ago at 9:00 AM
    endTime: createTimestampFromISO(
      format(
        new Date(new Date().setDate(new Date().getDate() - 2)),
        "yyyy-MM-dd'T'10:00:00"
      )
    ), // two days ago at 10:00 AM
  },
  {
    id: 11,
    title: "One-on-One",
    startTime: createTimestampFromISO(
      format(
        new Date(new Date().setDate(new Date().getDate() - 2)),
        "yyyy-MM-dd'T'11:00:00"
      )
    ), // two days ago at 11:00 AM
    endTime: createTimestampFromISO(
      format(
        new Date(new Date().setDate(new Date().getDate() - 2)),
        "yyyy-MM-dd'T'11:30:00"
      )
    ), // two days ago at 11:30 AM
  },
];

function App() {
  const [selectedPeriod, setSelectedPeriod] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<(typeof MODES)[keyof typeof MODES]>(
    MODES.WEEKLY
  );

  let days: Date[] = [];
  const startMonth = startOfMonth(selectedPeriod);
  const endMonth = endOfMonth(selectedPeriod);
  const startWeekMonth = startOfWeek(startMonth, { weekStartsOn: 0 });
  const endWeekMonth = endOfWeek(endMonth, { weekStartsOn: 0 });

  if (viewMode === MODES.MONTHLY) {
    days = eachDayOfInterval({
      start: startWeekMonth,
      end: endWeekMonth,
    });
  } else if (viewMode === MODES.WEEKLY) {
    days = eachDayOfInterval({
      start: startOfWeek(selectedPeriod, { weekStartsOn: 0 }),
      end: endOfWeek(selectedPeriod, { weekStartsOn: 0 }),
    });
  } else {
    days = [selectedPeriod];
  }

  const eventsOfDay = (day: Date) =>
    events.filter((e) => isSameDay(new Date(e.startTime), day));

  const isActive = (mode: (typeof MODES)[keyof typeof MODES]) =>
    viewMode === mode;

  const viewContainerClass = clsx(
    "gap-2",
    viewMode === MODES.MONTHLY && "grid grid-cols-7",
    viewMode === MODES.WEEKLY && "grid grid-cols-7",
    viewMode === MODES.DAILY && "grid grid-cols-1"
  );

  const changeViewMode = (mode: (typeof MODES)[keyof typeof MODES]) => {
    setViewMode(mode);
    setSelectedPeriod(new Date());
  };

  const setPreviousPeriod = () => {
    if (viewMode === MODES.MONTHLY) {
      setSelectedPeriod(
        new Date(selectedPeriod.getFullYear(), selectedPeriod.getMonth() - 1, 1)
      );
    } else if (viewMode === MODES.WEEKLY) {
      setSelectedPeriod(
        new Date(
          selectedPeriod.getFullYear(),
          selectedPeriod.getMonth(),
          selectedPeriod.getDate() - 7
        )
      );
    } else {
      setSelectedPeriod(
        new Date(
          selectedPeriod.getFullYear(),
          selectedPeriod.getMonth(),
          selectedPeriod.getDate() - 1
        )
      );
    }
  };

  const setNextPeriod = () => {
    if (viewMode === MODES.MONTHLY) {
      setSelectedPeriod(
        new Date(selectedPeriod.getFullYear(), selectedPeriod.getMonth() + 1, 1)
      );
    } else if (viewMode === MODES.WEEKLY) {
      setSelectedPeriod(
        new Date(
          selectedPeriod.getFullYear(),
          selectedPeriod.getMonth(),
          selectedPeriod.getDate() + 7
        )
      );
    } else {
      setSelectedPeriod(
        new Date(
          selectedPeriod.getFullYear(),
          selectedPeriod.getMonth(),
          selectedPeriod.getDate() + 1
        )
      );
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold underline">My Calendar</h1>
      <div className="flex space-x-4 mt-4">
        {Object.values(MODES).map((mode) => {
          const buttonClassName = clsx(
            "px-4 py-2 rounded",
            isActive(mode) ? "bg-blue-500 text-white" : "bg-gray-200"
          );

          const buttonTitle = `${
            mode.charAt(0).toUpperCase() + mode.slice(1)
          } View`;

          return (
            <button
              key={mode}
              className={buttonClassName}
              onClick={() => changeViewMode(mode)}
            >
              {buttonTitle}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded mr-2"
          onClick={() => setPreviousPeriod()}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={() => setNextPeriod()}
        >
          Next
        </button>
      </div>

      <div className={viewContainerClass}>
        {days.map((day) => (
          <DayCard
            events={eventsOfDay(day)}
            day={day}
            selectedPeriod={selectedPeriod}
            viewMode={viewMode}
          />
        ))}
      </div>
    </>
  );
}

export default App;
