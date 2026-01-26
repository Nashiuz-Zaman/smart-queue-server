import { TStaffAvailability, TStaffType } from "../../constants/staff";

export interface IStaff {
  name: string;
  serviceType: TStaffType;
  dailyCapacity: number; // max appointments per day
  availabilityStatus: TStaffAvailability;
  isActive: boolean;
}
