import { StaffModel } from "./staff.model";
import { IStaff } from "./staff.type";

const createStaff = async (payload: IStaff) => {
  return StaffModel.create(payload);
};

const getAllStaff = async () => {
  return StaffModel.find({ isActive: true }).sort({ createdAt: -1 });
};

const getSingleStaff = async (id: string) => {
  return StaffModel.findById(id);
};

const updateStaff = async (id: string, payload: Partial<IStaff>) => {
  return StaffModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

// Soft delete
const deleteStaff = async (id: string) => {
  return StaffModel.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );
};

export const StaffService = {
  createStaff,
  getAllStaff,
  getSingleStaff,
  updateStaff,
  deleteStaff,
};
