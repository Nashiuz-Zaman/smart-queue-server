import { StaffModel, IStaff } from "./staff.model";

export const createStaff = async (data: IStaff) => {
  return StaffModel.create(data);
};

export const getAllStaff = async () => {
  return StaffModel.find();
};

export const getStaffById = async (id: string) => {
  return StaffModel.findById(id);
};

export const updateStaff = async (id: string, data: Partial<IStaff>) => {
  return StaffModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteStaff = async (id: string) => {
  return StaffModel.findByIdAndDelete(id);
};
