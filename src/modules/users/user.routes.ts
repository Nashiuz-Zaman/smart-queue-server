import { Router } from "express";
import { signup, login, demoLogin, logout, checkAuth } from "./user.controller";
import { protect } from "../../middlewares/auth.middleware";

const userRouter = Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/demo-login", demoLogin);
userRouter.post("/logout", logout);
userRouter.get("/me", protect, checkAuth);

export default userRouter;
