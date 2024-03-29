import { ZodTypeAny } from "zod";
import { NextFunction, Request, Response } from "express";

export const validateBody =
  (schema: ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.parse(req.body);

    req.body = validation;
    return next();
  };
