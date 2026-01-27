import { Schema, model } from "mongoose";
import { IAppointment } from "./appointment.type";

// ----------------------------- Schema -----------------------------
const appointmentSchema = new Schema<IAppointment>(
  {
    customerName: { type: String, required: true },
    serviceName: { type: String, required: true },
    assignedStaff: { type: Schema.Types.ObjectId, ref: "Staff", default: null },
    dateTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled", "No-Show"],
      default: "Scheduled",
    },
  },
  { timestamps: true },
);

// ----------------------------- Model -----------------------------
export const AppointmentModel = model<IAppointment>(
  "Appointment",
  appointmentSchema,
);
