import { Router } from "express";
import { signup, login, demoLogin, logout } from "./user.controller";

const userRouter = Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/demo-login", demoLogin);
userRouter.post("/logout", logout);

export default userRouter;
