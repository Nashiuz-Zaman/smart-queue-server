import { Router } from "express";
import { AppointmentController } from "./appointment.controller";

const router = Router();

// ----------------------------- Routes -----------------------------
router.get("/", AppointmentController.getAppointments);
router.get("/services", AppointmentController.getUniqueServices);
router.get("/staff/:staffType", AppointmentController.getStaffByType);
router.post("/", AppointmentController.createAppointment);
router.patch("/:id", AppointmentController.updateAppointment);

export default router;
