import { User } from "../entity/User"

import jwt from "jsonwebtoken"
import { Guest } from "../entity/Guest"
import { JWT_SECRET } from "./env"

export const createToken = (user: User) => {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET!,
    {
      expiresIn: "30min",
    },
  )

  const refreshToken = jwt.sign(
    { userId: user.id, count: user.count },
    JWT_SECRET!,
    { expiresIn: "7days" },
  )

  return { accessToken, refreshToken }
}

export const createGuestToken = (guest: Guest) => {
  const accessToken = jwt.sign(
    { userId: guest.id, email: guest.email },
    JWT_SECRET!,
    {
      expiresIn: "30min",
    },
  )

  const refreshToken = jwt.sign(
    { userId: guest.id, count: guest.count },
    JWT_SECRET!,
    { expiresIn: "7days" },
  )

  return { accessToken, refreshToken }
}
