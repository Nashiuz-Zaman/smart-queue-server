import { Document } from "mongoose";

export interface IActivityLog extends Document {
  type: "QUEUE_ASSIGN" | "APPOINTMENT_UPDATE" | "APPOINTMENT_CANCEL";
  message: string;
  timestamp: Date;
  appointmentId?: string;
  staffId?: string;
  customerName?: string;
}
