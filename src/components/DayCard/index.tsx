import { clsx } from "clsx";
import type { IMeeting } from "../../types/meeting";
import { format, isSameDay, isSameMonth } from "date-fns";
import { MODES } from "../../constants/modes";
import { formatTimeOnly } from "../../utils/dateUtils";

type DayCardProps = {
  day: Date;
  events: IMeeting[];
  selectedPeriod: Date;
  viewMode: (typeof MODES)[keyof typeof MODES];
};

const hours = [
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

const DayCard = ({ day, events, selectedPeriod, viewMode }: DayCardProps) => {
  const today = new Date();

  const containerClassName = clsx(
    "border rounded-lg p-2 min-h-[100px] flex flex-col gap-1",
    isSameDay(day, today) && "border-blue-500",
    viewMode === MODES.MONTHLY &&
      !isSameMonth(day, selectedPeriod) &&
      "bg-gray-100 text-gray-400"
  );

  const dateTitle = isSameDay(day, today)
    ? "Today"
    : format(day, "EEEE, MMM d");

  const dayEvents = events.filter((event) =>
    isSameDay(new Date(event.startTime), day)
  );

  const eventsWithPositions = dayEvents.map((event) => {
    const eventStart = new Date(event.startTime);
    const eventEnd = new Date(event.endTime);
    const startHour = eventStart.getHours();
    const startMinute = eventStart.getMinutes();
    const endHour = eventEnd.getHours();
    const endMinutes = eventEnd.getMinutes();

    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinutes;

    const span =
      endMinutes === 0 ? endHour - startHour : endHour - startHour + 1;

    return {
      ...event,
      gridRowStart: startHour + 1,
      gridRowEnd: startHour + span + 1,
      startHour,
      span,
      startTimeInMinutes,
      endTimeInMinutes,
    };
  });

  const eventsOverlap = (event1: any, event2: any) => {
    return (
      event1.startTimeInMinutes < event2.endTimeInMinutes &&
      event2.startTimeInMinutes < event1.endTimeInMinutes
    );
  };

  const sortedEvents = [...eventsWithPositions].sort(
    (a, b) => a.startTimeInMinutes - b.startTimeInMinutes
  );
  const eventPositions: Array<
    (typeof eventsWithPositions)[0] & { column: number }
  > = [];

  sortedEvents.forEach((event) => {
    let column = 1;

    const conflictingEvents = eventPositions.filter((positioned) =>
      eventsOverlap(event, positioned)
    );
    const usedColumns = new Set(conflictingEvents.map((e) => e.column));

    while (usedColumns.has(column)) {
      column++;
    }

    eventPositions.push({
      ...event,
      column,
    });
  });

  const maxColumns = Math.max(
    1,
    ...eventPositions.map((event) => event.column)
  );
  const gridCols = `auto repeat(${maxColumns}, 1fr)`;

  return (
    <div className={containerClassName}>
      <span className="text-sm font-semibold h-10">{dateTitle}</span>
      <div
        className="grid grid-rows-24 gap-0 relative"
        style={{ gridTemplateColumns: gridCols }}
      >
        {hours.map((hour, index) => (
          <div
            key={`hour-${hour}`}
            className="text-sm py-1 pr-2 border-b border-gray-200"
            style={{ gridRow: index + 1, gridColumn: 1 }}
          >
            {hour}
          </div>
        ))}

        {hours.map((hour, index) =>
          Array.from({ length: maxColumns }, (_, colIndex) => (
            <div
              key={`slot-${hour}-${colIndex}`}
              className="border-b border-r border-gray-200 min-h-[30px]"
              style={{
                gridRow: index + 1,
                gridColumn: colIndex + 2,
              }}
            />
          ))
        )}
        {eventPositions.map((event) => (
          <div
            key={event.id}
            className="bg-blue-100 text-blue-700 border-l-4 border-blue-400 px-2 py-1 mx-1 rounded text-xs z-10"
            style={{
              gridRow: `${event.gridRowStart} / ${event.gridRowEnd}`,
              gridColumn: event.column + 1,
            }}
          >
            <div className="font-medium">{event.title}</div>
            <div className="text-xs text-blue-600">
              {formatTimeOnly(event.startTime)} -{" "}
              {formatTimeOnly(event.endTime)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayCard;
