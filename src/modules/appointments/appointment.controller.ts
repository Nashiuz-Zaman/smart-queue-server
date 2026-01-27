import { Request, Response } from "express";
import { AppointmentService } from "./appointment.service";
import { catchAsync, sendSuccess } from "../../utils";

// ----------------------------- Controller -----------------------------
export const AppointmentController = {
  getAppointments: catchAsync(async (req: Request, res: Response) => {
    const filters = req.query;
    const appointments = await AppointmentService.getAppointments(
      filters as any,
    );
    sendSuccess(res, { data: appointments });
  }),

  getUniqueServices: catchAsync(async (_req: Request, res: Response) => {
    const services = await AppointmentService.getUniqueServices();
    sendSuccess(res, { data: services });
  }),

  getStaffByType: catchAsync(async (req: Request, res: Response) => {
    const { staffType } = req.params;
    const staffList = await AppointmentService.getStaffByType(staffType);
    sendSuccess(res, { data: staffList });
  }),

  createAppointment: catchAsync(async (req: Request, res: Response) => {
    const appointment = await AppointmentService.createAppointment(req.body);
    sendSuccess(res, {
      data: appointment,
      message: "Appointment created successfully",
    });
  }),

  updateAppointment: catchAsync(async (req: Request, res: Response) => {
    const appointment = await AppointmentService.updateAppointment(
      req.params.id,
      req.body,
    );
    sendSuccess(res, {
      data: appointment,
      message: "Appointment updated successfully",
    });
  }),
};
