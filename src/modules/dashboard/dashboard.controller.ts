import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";
import { catchAsync, sendSuccess } from "../../utils";

export const DashboardController = {
  getDashboard: catchAsync(async (_req: Request, res: Response) => {
    const data = await DashboardService.getDashboardData();
    sendSuccess(res, { data });
  }),
};
