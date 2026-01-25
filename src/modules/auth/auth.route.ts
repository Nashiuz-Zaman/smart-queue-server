import { Router } from "express";
import { signup, login, demoLogin, logout } from "./auth.controller";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/demo-login", demoLogin);
router.post("/logout", logout);

export default router;
