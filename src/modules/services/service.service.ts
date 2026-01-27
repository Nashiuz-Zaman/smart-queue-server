import { throwBadRequest } from "../../utils";
import { ServiceModel } from "./service.model";
import { IService } from "./service.type";

const createService = async (data: IService) => {
  const existingService = await ServiceModel.exists({ name: data.name });

  if (existingService) return throwBadRequest("Service already exists");

  return ServiceModel.create(data);
};

const getAllServices = async () => {
  return ServiceModel.find({ isActive: true });
};

const getSingleService = async (id: string) => {
  return ServiceModel.findById(id);
};

const updateService = async (id: string, data: Partial<IService>) => {
  return ServiceModel.findByIdAndUpdate(id, data, { new: true });
};

const deleteService = async (id: string) => {
  // soft delete
  return ServiceModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
};

export const ServiceService = {
  createService,
  getAllServices,
  getSingleService,
  updateService,
  deleteService,
};
