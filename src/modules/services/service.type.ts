import { TServiceDuration } from "../../constants/service";
import { TStaffType } from "../../constants/staff";

export interface IService {
  name: string;
  duration: TServiceDuration;
  requiredStaffType: TStaffType;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
