import { Schema, model } from "mongoose";

export interface IStaff {
  name: string;
  serviceType: string; // e.g., Doctor, Consultant
  dailyCapacity: number; // max 5
  availabilityStatus: "Available" | "On Leave";
}

const staffSchema = new Schema<IStaff>(
  {
    name: { type: String, required: true },
    serviceType: { type: String, required: true },
    dailyCapacity: { type: Number, required: true, default: 5, max: 5 },
    availabilityStatus: {
      type: String,
      enum: ["Available", "On Leave"],
      default: "Available",
    },
  },
  { timestamps: true }
);

export const StaffModel = model<IStaff>("Staff", staffSchema);
