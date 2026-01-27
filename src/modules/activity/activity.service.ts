import { ActivityModel } from "./activity.model";
import { IActivityLog } from "./activity.type";

export const ActivityService = {
  log: async ({
    type,
    message,
    appointmentId,
    staffId,
    customerName,
  }: Partial<IActivityLog>) => {
    return ActivityModel.create({
      type,
      message,
      appointmentId,
      staffId,
      customerName,
      timestamp: new Date(),
    });
  },

  getRecent: async (limit = 10) => {
    return ActivityModel.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate("appointmentId", "customerName dateTime serviceName")
      .populate("staffId", "name serviceType");
  },
};
