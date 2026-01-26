export const formatDateTime = (
  isoDate: string,
  includeTime: boolean = true
): string => {
  const date = new Date(isoDate);

  const day = date.getDate().toString().padStart(2, "0");
  const monthShort = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  if (!includeTime) {
    return `${monthShort} ${day} ${year}`;
  }

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12 || 12;
  const hoursStr = hours.toString().padStart(2, "0");

  return `${hoursStr}:${minutes} ${ampm.toUpperCase()} - ${monthShort} ${day} ${year}`;
};
