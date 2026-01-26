import { Router } from "express";
import { StaffController } from "./staff.controller";

const router = Router();

router.post("/", StaffController.createStaff);
router.get("/", StaffController.getAllStaff);
router.get("/:id", StaffController.getSingleStaff);
router.patch("/:id", StaffController.updateStaff);
router.delete("/:id", StaffController.deleteStaff);

export default router;
