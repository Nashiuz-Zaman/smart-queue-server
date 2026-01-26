export const generateTimeSlots = (
  startHour: number = 9,
  endHour: number = 17,
  intervalMinutes: number = 30,
): string[] => {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      slots.push(timeString);
    }
  }
  return slots;
};

export const parseTime = (
  timeString: string,
): { hour: number; minute: number } => {
  const [hour, minute] = timeString.split(":").map(Number);
  return { hour, minute };
};

export const addMinutesToTime = (
  timeString: string,
  minutesToAdd: number,
): string => {
  const { hour, minute } = parseTime(timeString);
  const totalMinutes = hour * 60 + minute + minutesToAdd;
  const newHour = Math.floor(totalMinutes / 60) % 24;
  const newMinute = totalMinutes % 60;
  return `${newHour.toString().padStart(2, "0")}:${newMinute
    .toString()
    .padStart(2, "0")}`;
};

export const isTimeOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string,
): boolean => {
  const start1Minutes = parseTime(start1).hour * 60 + parseTime(start1).minute;
  const end1Minutes = parseTime(end1).hour * 60 + parseTime(end1).minute;
  const start2Minutes = parseTime(start2).hour * 60 + parseTime(start2).minute;
  const end2Minutes = parseTime(end2).hour * 60 + parseTime(end2).minute;

  return start1Minutes < end2Minutes && end1Minutes > start2Minutes;
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export const combineDateAndTime = (
  dateString: string,
  timeString: string,
): Date => {
  return new Date(`${dateString}T${timeString}:00`);
};
