import { Router } from "express";
import { DashboardController } from "./dashboard.controller";

const dashboardRouter = Router();

// GET /dashboard → fetch dashboard stats
dashboardRouter.get("/", DashboardController.getDashboard);

export default dashboardRouter;
