import { Request, Response } from "express";
import { userLoader } from "../dataloaders/dataloaders";

export interface Session {
  userId?: string;
}

export interface MyRequest extends Request {
  userId?: string;
}

export interface MyContext {
  req: MyRequest;
  res: Response;
  userLoader: ReturnType<typeof userLoader>;
  userId?: string;
}
