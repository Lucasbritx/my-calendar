import type { IMeeting } from "../../types/meeting";
import { formatFullDateTime } from "../../utils/dateUtils";

type DayCardProps = {
  schedules: IMeeting[]
};

const DayCard = ({ schedules }: DayCardProps) => (
  <div className="day-card p-4 mb-4 border rounded">
    <h2 className="text-2xl font-bold mb-4">Today's Schedule</h2>
    {schedules.length === 0 ? (
      <p className="text-gray-600">No meetings scheduled for today.</p>
    ) : (
      schedules.map(meeting => (
        <div key={meeting.id} className="meeting-card p-4 mb-4 border rounded">
          <h3 className="text-xl font-semibold">{meeting.title}</h3>
          <p className="text-gray-600">{meeting.formattedDate}</p>
          <p className="text-gray-600">
            {meeting.formattedStartTime} - {meeting.formattedEndTime}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Start: {formatFullDateTime(meeting.startTime)}
          </p>
          <p className="text-sm text-gray-500">
            End: {formatFullDateTime(meeting.endTime)}
          </p>
        </div>
      ))
    )}
  </div>
);

export default DayCard;
