export const STAFF_TYPES = [
  "Doctor",
  "Consultant",
  "Support",
  "Teacher",
  "Trainer",
  "Technician",
  "Advisor",
  "Counselor",
  "Receptionist",
  "Assistant",
] as const;
export type TStaffType = (typeof STAFF_TYPES)[number];

export const STAFF_AVAILIBILITY_OPTIONS = ["Available", "On Leave"];
export type TStaffAvailability = (typeof STAFF_AVAILIBILITY_OPTIONS)[number];
