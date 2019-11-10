import { User } from "../entity/User"
import config from "../config"
import jwt from "jsonwebtoken"
import { Guest } from "../entity/Guest"

export const createToken = (user: User) => {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    config.JWT_SECRET,
    {
      expiresIn: "30min",
    },
  )

  const refreshToken = jwt.sign(
    { userId: user.id, count: user.count },
    config.JWT_SECRET,
    { expiresIn: "7days" },
  )

  return { accessToken, refreshToken }
}

export const createGuestToken = (guest: Guest) => {
  const accessToken = jwt.sign(
    { userId: guest.id, email: guest.email },
    config.JWT_SECRET,
    {
      expiresIn: "30min",
    },
  )

  const refreshToken = jwt.sign(
    { userId: guest.id, count: guest.count },
    config.JWT_SECRET,
    { expiresIn: "7days" },
  )

  return { accessToken, refreshToken }
}
