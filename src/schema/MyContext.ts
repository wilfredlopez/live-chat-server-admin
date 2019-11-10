import { Request, Response } from "express"
import { userLoader } from "../dataloaders/dataloaders"

export interface Session {
  userId?: string
}

export interface MyContext {
  req: Request
  res: Response
  userLoader: ReturnType<typeof userLoader>
  userId?: string
}
