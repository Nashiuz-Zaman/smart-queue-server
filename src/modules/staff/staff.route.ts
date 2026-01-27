import { Router } from "express";
import { StaffController } from "./staff.controller";

const staffRouter = Router();

staffRouter.post("/", StaffController.createStaff);
staffRouter.get("/", StaffController.getAllStaff);
staffRouter.get("/:id", StaffController.getSingleStaff);
staffRouter.patch("/:id", StaffController.updateStaff);
staffRouter.delete("/:id", StaffController.deleteStaff);
staffRouter.get("/types/all", StaffController.getStaffTypes);

export default staffRouter;
