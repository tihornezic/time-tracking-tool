import { format } from "date-fns";
import { Tracker } from "../types/types";

// formats seconds to HH:mm:ss format
export const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num: number) => String(num).padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

export const filterByStartDate = (array: Tracker[], startDate: Date) => {
  const formattedStartDate = format(new Date(startDate), "d.M.yyyy.");

  const filters = array.filter(
    (tracker) => format(tracker.startDate, "d.M.yyyy.") === formattedStartDate
  );

  return filters;
};

export const filterByEndDate = (array: Tracker[], endDate: Date) => {
  const formattedEndDate = format(new Date(endDate as Date), "d.M.yyyy.");

  const filters = array.filter(
    (tracker) =>
      format(String(tracker.endDate), "d.M.yyyy.") === formattedEndDate
  );

  return filters;
};

export const filterByStartAndEndDate = (
  array: Tracker[],
  startDate: Date,
  endDate: Date
) => {
  const startMillis = new Date(startDate).getTime();
  const endMillis = new Date(endDate).getTime();

  // console.log("startMillis", startMillis);

  const span = array.filter((item) => {
    const itemStartDateMillis = item.startDate;

    // return all trackers whose startDate is between bounds of start and end date
    return (
      itemStartDateMillis >= startMillis && itemStartDateMillis <= endMillis
    );
  });

  return span;
};

export const filterByDescription = (array: Tracker[], description: string) => {
  return array.filter((tracker) =>
    tracker.description.toLowerCase().includes(description.toLowerCase())
  );
};
