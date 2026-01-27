import { Types } from "mongoose";

export interface IAppointment {
  _id?: Types.ObjectId;
  customerName: string;
  serviceName: string; // string, unique from ServiceModel
  assignedStaff?: Types.ObjectId | null; // staff _id
  dateTime: Date;
  endTime: Date;
  status: "Scheduled" | "Completed" | "Cancelled" | "No-Show";
}

export interface IAppointmentFilter {
  serviceName?: IAppointment["serviceName"];
  assignedStaff?: string;
  dateTime?: string; // ISO date string
}
