import { Router } from "express";
import {
  createStaffHandler,
  getAllStaffHandler,
  getStaffByIdHandler,
  updateStaffHandler,
  deleteStaffHandler,
} from "./staff.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.use(protect); // all routes protected

router.post("/", createStaffHandler);
router.get("/", getAllStaffHandler);
router.get("/:id", getStaffByIdHandler);
router.put("/:id", updateStaffHandler);
router.delete("/:id", deleteStaffHandler);

export default router;
