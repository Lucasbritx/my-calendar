import type { IMeeting } from "../../types/meeting";
import { formatFullDateTime } from "../../utils/dateUtils";

type ScheduleCardProps = {
  meeting: IMeeting
};

const ScheduleCard = ({ meeting }: ScheduleCardProps) => (
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
);

export default ScheduleCard;
