import { Request, Response } from "express";
import { ServiceService } from "./service.service";
import { catchAsync, sendSuccess } from "../../utils";
import httpStatus from "http-status";

/* Create Service */
const createService = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceService.createService(req.body);
  sendSuccess(res, {
    code: httpStatus.CREATED,
    message: "Service created successfully",
    data: result,
  });
});

/* Get All Services */
const getAllServices = catchAsync(async (_req: Request, res: Response) => {
  const result = await ServiceService.getAllServices();
  sendSuccess(res, { data: result });
});

/* Get Single Service */
const getSingleService = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceService.getSingleService(req.params.id);
  sendSuccess(res, { data: result });
});

/* Update Service */
const updateService = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceService.updateService(req.params.id, req.body);
  sendSuccess(res, { message: "Service updated successfully", data: result });
});

/* Delete Service (Soft) */
const deleteService = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceService.deleteService(req.params.id);
  sendSuccess(res, { message: "Service deleted successfully", data: result });
});

export const ServiceController = {
  createService,
  getAllServices,
  getSingleService,
  updateService,
  deleteService,
};
