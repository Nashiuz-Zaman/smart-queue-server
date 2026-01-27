import { model, Schema } from "mongoose";
import { IActivityLog } from "./activity.type";

const activitySchema = new Schema<IActivityLog>({
  type: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment" },
  staffId: { type: Schema.Types.ObjectId, ref: "Staff" },
  customerName: { type: String },
});

export const ActivityModel = model<IActivityLog>("Activity", activitySchema);
