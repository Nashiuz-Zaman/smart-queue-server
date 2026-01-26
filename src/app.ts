import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./modules/users/user.routes";
import staffRoutes from "./modules/staff/staff.route";
import serviceRoutes from "./modules/services/service.route";
import appointmentRoutes from "./modules/appointments/appointment.route";
import activityRoutes from "./modules/activity/activity.route";

export const app = express();

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

app.use("/auth", authRoutes);
app.use("/staff", staffRoutes);
app.use("/services", serviceRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/activity", activityRoutes);
