import { format, parseISO, parse, getTime } from "date-fns";

export const createTimestamp = (dateStr: string, timeStr: string): number => {
  const date = parseISO(dateStr);
  const time = parse(timeStr, 'h:mm a', new Date());
  
  const dateTime = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes()
  );
  
  return getTime(dateTime);
};

export const createTimestampFromISO = (isoString: string): number => {
  return getTime(parseISO(isoString));
};

export const timestampToDate = (timestamp: number): Date => {
  return new Date(timestamp);
};

export const formatReadableDate = (timestamp: number): string => {
  return format(new Date(timestamp), 'EEEE, MMMM do, yyyy');
};

export const formatTime = (timestamp: number): string => {
  return format(new Date(timestamp), 'h:mm a');
};

export const formatFullDateTime = (timestamp: number): string => {
  return format(new Date(timestamp), 'PPpp');
};

export const formatDateOnly = (timestamp: number): string => {
  return format(new Date(timestamp), 'MMMM d, yyyy');
};

export const formatTimeOnly = (timestamp: number): string => {
  return format(new Date(timestamp), 'h:mm a');
};

export const processMeetingsData = (meetings: Array<{
  id: number;
  title: string;
  startTime: number;
  endTime: number;
}>) => {
  return meetings.map(meeting => ({
    ...meeting,
    formattedDate: formatReadableDate(meeting.startTime),
    formattedStartTime: formatTime(meeting.startTime),
    formattedEndTime: formatTime(meeting.endTime),
    formattedDateOnly: formatDateOnly(meeting.startTime),
    formattedTimeOnly: formatTimeOnly(meeting.startTime),
  }));
};
