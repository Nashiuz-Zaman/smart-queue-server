import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./modules/users/user.routes";
import staffRoutes from "./modules/staff/staff.route";
import serviceRoutes from "./modules/services/service.route";
import appointmentRoutes from "./modules/appointments/appointment.route";
import activityRoutes from "./modules/activity/activity.route";
import { errorMiddleware } from "./middlewares/error.middleware";
import { AppError } from "./classes";

export const app = express();

app.set("trust proxy", 1);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

app.use(express.json());
app.use(cookieParser());

// Health check route
app.get("/health", (_, res: Response) => {
  res.send("Working properly");
});

app.use("/user", userRoutes);
app.use("/staff", staffRoutes);
app.use("/services", serviceRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/activity", activityRoutes);

// 404 handler
app.all("*", (req: Request, _: Response, next: NextFunction) => {
  next(new AppError(`${req.url} is an invalid url`, 404));
});

app.use(errorMiddleware);
