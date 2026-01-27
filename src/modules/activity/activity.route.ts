import { Router } from "express";
import { ActivityController } from "./activity.controller";

const activityRouter = Router();

activityRouter.get("/recent", ActivityController.getRecentActivities);

export default activityRouter;
