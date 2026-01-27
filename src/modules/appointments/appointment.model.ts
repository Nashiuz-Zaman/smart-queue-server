import { Schema, model } from "mongoose";
import { IAppointment } from "./appointment.type";
import { APPOINTMENT_STATUSES } from "../../constants/appointment";

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
      enum: APPOINTMENT_STATUSES,
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
