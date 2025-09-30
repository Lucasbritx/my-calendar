import { clsx } from "clsx";
import type { IMeeting } from "../../types/meeting";
import { format, isSameDay, isSameMonth } from "date-fns";
import { MODES } from "../../constants/modes";

type DayCardProps = {
  day: Date;
  events: IMeeting[];
  selectedPeriod: Date;
  viewMode: (typeof MODES)[keyof typeof MODES];
};

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

  return (
    <div className={containerClassName}>
      <span className="text-sm font-semibold">{dateTitle}</span>
      <ul className="space-y-1 text-xs">
        {events.map((event) => (
          <li
            key={event.id}
            className="px-2 py-1 rounded bg-blue-100 text-blue-700"
          >
            {event.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DayCard;
