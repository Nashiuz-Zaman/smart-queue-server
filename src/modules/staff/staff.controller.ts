import { Request, Response } from "express";
import * as staffService from "./staff.service";

export const createStaffHandler = async (req: Request, res: Response) => {
  try {
    const staff = await staffService.createStaff(req.body);
    res.status(201).json(staff);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllStaffHandler = async (_req: Request, res: Response) => {
  try {
    const staff = await staffService.getAllStaff();
    res.json(staff);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getStaffByIdHandler = async (req: Request, res: Response) => {
  try {
    const staff = await staffService.getStaffById(req.params.id as string);
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json(staff);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateStaffHandler = async (req: Request, res: Response) => {
  try {
    const staff = await staffService.updateStaff(
      req.params.id as string,
      req.body,
    );
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json(staff);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteStaffHandler = async (req: Request, res: Response) => {
  try {
    const staff = await staffService.deleteStaff(req.params.id as string);
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json({ message: "Staff deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
