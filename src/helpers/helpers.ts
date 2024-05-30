import { format } from "date-fns";

// formats seconds to HH:mm:ss format
export const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num) => String(num).padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

export const filterByStartDate = (array: any, startDate: string) => {
  const formattedStartDate = format(new Date(startDate as string), "d.M.yyyy.");

  const filters = array.filter(
    (timer) => format(timer.startDate, "d.M.yyyy.") === formattedStartDate
  );

  return filters;
};

export const filterByEndDate = (array: any, endDate: string) => {
  const formattedEndDate = format(new Date(endDate as string), "d.M.yyyy.");

  const filters = array.filter(
    (timer) => format(timer.endDate, "d.M.yyyy.") === formattedEndDate
  );

  return filters;
};

export const filterByStartAndEndDate = (
  array: any,
  startDate: string,
  endDate: string
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

export const filterByDescription = (array: any, description: string) => {
  return array.filter((timer) =>
    timer.description.toLowerCase().includes(description.toLowerCase())
  );
};
