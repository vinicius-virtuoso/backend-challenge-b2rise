import { validateBody } from "@/app/middlewares/validate-body";
import { Router } from "express";
import { AdminsController } from "../controllers/admins-controller";
import { adminSchemaRequest } from "@/app/interfaces/admins-interfaces";
import { adminAlreadyExists } from "@/app/middlewares/admins-middleware/admin-already-exists";
import { PrismaAdminsRepository } from "@/infra/database/repositories/prisma-admins-repository";

const adminsRepository = new PrismaAdminsRepository();
const adminsController = new AdminsController(adminsRepository);

export const adminsRoutes = Router();

adminsRoutes.post(
  "/",
  validateBody(adminSchemaRequest),
  adminAlreadyExists(adminsRepository),
  adminsController.create
);