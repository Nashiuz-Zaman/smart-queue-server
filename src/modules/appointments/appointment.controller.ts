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
  getWaitingQueue: catchAsync(async (_req: Request, res: Response) => {
    const waitingQueue = await AppointmentService.getWaitingQueue();

    // Add queue positions dynamically
    const queueWithPosition = waitingQueue.map((appt, idx) => ({
      ...appt.toObject(),
      queuePosition: idx + 1,
    }));

    sendSuccess(res, { data: queueWithPosition });
  }),
  assignFromQueue: catchAsync(async (req: Request, res: Response) => {
    const { staffId } = req.params;
    const assignedAppointment =
      await AppointmentService.assignFromQueue(staffId);

    if (!assignedAppointment) {
      return sendSuccess(res, {
        message: "No eligible appointments in waiting queue",
      });
    }

    sendSuccess(res, {
      data: assignedAppointment,
      message: "Appointment assigned from waiting queue",
    });
  }),
};
