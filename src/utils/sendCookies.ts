import { MyContext } from "../schema/MyContext"
import { Response } from "express"

const hour = 3600000

export function SendCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
) {
  res.cookie("refresh-token", refreshToken, {
    // expires: true,
    maxAge: 14 * 24 * hour, //2 weeks
    // httpOnly: true,
    // domain: ".herokuapp.com",
    // sameSite: false,
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
  })

  res.cookie("access-token", accessToken, {
    // expires: true,
    maxAge: 24 * hour, //24 hours
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
  })
}
