import { Response } from "express";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const hour = 3600000;

export function SendCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
) {
  res.cookie(REFRESH_TOKEN, refreshToken, {
    // expires: true,
    maxAge: 14 * 24 * hour, //2 weeks
    // httpOnly: true,
    // domain: ".herokuapp.com",
    // sameSite: false,
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production"
  });

  res.cookie(ACCESS_TOKEN, accessToken, {
    // expires: true,
    maxAge: 24 * hour, //24 hours
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production"
  });
}
