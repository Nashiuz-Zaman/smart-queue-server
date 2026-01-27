import { Types } from "mongoose";
import { TAppointmentStatus } from "../../constants/appointment";

export interface IAppointment {
  _id?: Types.ObjectId;
  customerName: string;
  serviceName: string; // string, unique from ServiceModel
  assignedStaff?: Types.ObjectId | null; // staff _id
  dateTime: Date;
  endTime: Date;
  status: TAppointmentStatus;
}

export interface IAppointmentFilter {
  serviceName?: IAppointment["serviceName"];
  assignedStaff?: string;
  dateTime?: string; // ISO date string
}
