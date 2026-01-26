import { Schema, model } from "mongoose";
import { IStaff } from "./staff.type";
import { STAFF_AVAILIBILITY_OPTIONS, STAFF_TYPES } from "../../constants/staff";

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
      enum: STAFF_TYPES,
    },
    dailyCapacity: {
      type: Number,
      required: true,
      default: 5,
      min: 1,
    },
    availabilityStatus: {
      type: String,
      enum: STAFF_AVAILIBILITY_OPTIONS,
      default: STAFF_AVAILIBILITY_OPTIONS[0],
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
