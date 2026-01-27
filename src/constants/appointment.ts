// ----------------------------- Appointment Status -----------------------------
export const APPOINTMENT_STATUSES = [
  "Scheduled",
  "Completed",
  "Cancelled",
  "No-Show",
] as const;

// ----------------------------- Types -----------------------------
export type TAppointmentStatus = typeof APPOINTMENT_STATUSES[number];
