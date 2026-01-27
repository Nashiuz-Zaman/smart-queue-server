import { connectDB } from "./config/db";
import { env } from "./config/env";
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./modules/users/user.routes";
import staffRouter from "./modules/staff/staff.route";
import serviceRouter from "./modules/services/service.route";
import appointmentRouter from "./modules/appointments/appointment.route";
import activityRouter from "./modules/activity/activity.route";
import dashboardRouter from "./modules/dashboard/dashoard.route";
import { AppError } from "./classes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

// app.set("trust proxy", 1);
app.use(
  cors({
    origin: ["https://smart-queue-client.vercel.app", "http://localhost:3000"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

app.use(express.json());
app.use(cookieParser());

// Health check route
app.get("/health", (_, res: Response) => {
  res.send("Working properly");
});

app.use("/user", userRouter);
app.use("/staff", staffRouter);
app.use("/services", serviceRouter);
app.use("/appointments", appointmentRouter);
app.use("/activity", activityRouter);
app.use("/dashbaord", dashboardRouter);

// 404 handler
app.all("*", (req: Request, _: Response, next: NextFunction) => {
  next(new AppError(`${req.url} is an invalid url`, 404));
});

app.use(errorMiddleware);

const main = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT}`);
  });
};

main();

export default app;
