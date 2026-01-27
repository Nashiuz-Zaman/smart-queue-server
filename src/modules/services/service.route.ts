// src/modules/services/service.routes.ts
import { Router } from "express";
import { ServiceController } from "./service.controller";

const serviceRouter = Router();

serviceRouter.post("/", ServiceController.createService);
serviceRouter.get("/", ServiceController.getAllServices);
serviceRouter.get("/:id", ServiceController.getSingleService);
serviceRouter.put("/:id", ServiceController.updateService);
serviceRouter.delete("/:id", ServiceController.deleteService);

export default serviceRouter;
