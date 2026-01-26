export type TStaffAvailability = "AVAILABLE" | "ON_LEAVE";

export interface IStaff {
  name: string;
  serviceType: string; // e.g. Doctor, Consultant
  dailyCapacity: number; // max appointments per day
  availabilityStatus: TStaffAvailability;
  isActive: boolean;
}
