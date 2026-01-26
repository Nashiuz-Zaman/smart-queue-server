import { Request, Response } from "express";
import httpStatus from "http-status";
import { StaffService } from "./staff.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendSuccess } from "../../utils/sendSuccess";

/* Create Staff */
const createStaff = catchAsync(async (req: Request, res: Response) => {
  const result = await StaffService.createStaff(req.body);

  sendSuccess(res, {
    code: httpStatus.CREATED,
    message: "Staff created successfully",
    data: result,
  });
});

/* Get All Staff */
const getAllStaff = catchAsync(async (_req: Request, res: Response) => {
  const result = await StaffService.getAllStaff();

  sendSuccess(res, {
    data: result,
  });
});

/* Get Single Staff */
const getSingleStaff = catchAsync(async (req: Request, res: Response) => {
  const result = await StaffService.getSingleStaff(req.params.id);

  sendSuccess(res, {
    data: result,
  });
});

/* Update Staff */
const updateStaff = catchAsync(async (req: Request, res: Response) => {
  const result = await StaffService.updateStaff(req.params.id, req.body);

  sendSuccess(res, {
    message: "Staff updated successfully",
    data: result,
  });
});

/* Delete Staff (Soft) */
const deleteStaff = catchAsync(async (req: Request, res: Response) => {
  const result = await StaffService.deleteStaff(req.params.id);

  sendSuccess(res, {
    message: "Staff deleted successfully",
    data: result,
  });
});

/* Get Staff Types (for dropdowns) */
const getStaffTypes = catchAsync(async (_req: Request, res: Response) => {
  sendSuccess(res, {
    data: STAFF_TYPES,
  });
});

export const StaffController = {
  createStaff,
  getAllStaff,
  getSingleStaff,
  updateStaff,
  deleteStaff,
  getStaffTypes, // <- added
};
