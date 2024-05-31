export enum EnumAuth {
  login,
  register,
}

export enum EnumTrackerStatus {
  active = "active",
  in_progress = "in_progress",
  paused = "paused",
  closed = "closed",
  disabled = "disabled",
}

export type Tracker = {
  id: string;
  description: string;
  // unix epoch timestamp
  startDate: number;
  // unix epoch timestamp
  endDate: number | null;
  // number of seconds a tracker (timer) took - later converted to HH:mm:ss
  seconds: number;
  status: EnumTrackerStatus;
};
