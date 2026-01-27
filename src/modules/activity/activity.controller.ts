import { Request, Response } from "express";
import { ActivityService } from "./activity.service";
import { catchAsync, sendSuccess } from "../../utils";

export const ActivityController = {
  getRecentActivities: catchAsync(async (_req: Request, res: Response) => {
    const logs = await ActivityService.getRecent(10);
    sendSuccess(res, { data: logs });
  }),
};
