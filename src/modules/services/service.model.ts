import { Schema, model } from "mongoose";
import { IService } from "./service.type";
import { SERVICE_DURATIONS } from "../../constants/service";
import { STAFF_TYPES } from "../../constants/staff";

const serviceSchema = new Schema<IService>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    duration: { type: Number, enum: SERVICE_DURATIONS, required: true },
    requiredStaffType: { type: String, enum: STAFF_TYPES, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const ServiceModel = model<IService>("Service", serviceSchema);
