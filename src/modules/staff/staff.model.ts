import { Schema, model } from "mongoose";
import { IStaff } from "./staff.type";

const staffSchema = new Schema<IStaff>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    dailyCapacity: {
      type: Number,
      required: true,
      default: 5,
      min: 1,
    },
    availabilityStatus: {
      type: String,
      enum: ["AVAILABLE", "ON_LEAVE"],
      default: "AVAILABLE",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const StaffModel = model<IStaff>("Staff", staffSchema);
