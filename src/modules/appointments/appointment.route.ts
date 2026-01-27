import { Router } from "express";
import { AppointmentController } from "./appointment.controller";

const appointmentRouter = Router();

// ----------------------------- Routes -----------------------------
appointmentRouter.get("/", AppointmentController.getAppointments);
appointmentRouter.get("/services", AppointmentController.getUniqueServices);
appointmentRouter.get(
  "/staff/:staffType",
  AppointmentController.getStaffByType,
);
appointmentRouter.post("/", AppointmentController.createAppointment);
appointmentRouter.patch("/:id", AppointmentController.updateAppointment);

// ----------------------------- Waiting Queue Routes -----------------------------
appointmentRouter.get("/waiting-queue", AppointmentController.getWaitingQueue);
appointmentRouter.post(
  "/waiting-queue/assign/:staffId",
  AppointmentController.assignFromQueue,
);

export default appointmentRouter;
