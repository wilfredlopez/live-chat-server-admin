import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken"
import { User } from "../entity/User"
import { createToken, createGuestToken } from "../utils/createToken"
import { SendCookies } from "../utils/sendCookies"
import { Guest } from "../entity/Guest"
import { JWT_SECRET } from "../utils/env"

export const authMiddleware = async function(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  //logic here
  try {
    const accessToken = req.cookies["access-token"]
    const refreshToken = req.cookies["refresh-token"]
    // console.log(accessToken)

    if (!refreshToken && !accessToken) {
      return next()
    }

    try {
      const data = await verify(accessToken, JWT_SECRET!)

      // console.log(data)

      //@ts-ignore
      req.userId = data.userId

      //@ts-ignore
      req.email = data.email

      next()
    } catch (error) {
      const data = (await verify(refreshToken, JWT_SECRET!)) as any

      let user: User | Guest = await User.findOneOrFail(data.userId)
      // let user: User = await User.findOneOrFail(data.userId)

      if (!user) {
        user = await Guest.findOneOrFail(data.userId)
      }

      if (!user || user.count !== data.count) {
        return next() //user count is not valid or no user
      }

      let tokens

      if (user instanceof User) {
        tokens = createToken(user)
      } else {
        tokens = createGuestToken(user)
      }
      // const hour = 3600000

      // res.cookie("refresh-token", tokens.refreshToken, {
      //   expires: true,
      //   maxAge: 14 * 24 * hour, //2 weeks

      //   httpOnly: true,
      // })

      // res.cookie("access-token", tokens.accessToken, {
      //   expires: true,
      //   maxAge: 24 * hour, //24 hours
      //   httpOnly: true,
      // })

      await user.save()
      SendCookies(res, tokens.accessToken, tokens.refreshToken)

      //@ts-ignore
      req.userId = data.userId
      //@ts-ignore
      req.email = data.email

      next()
    }
  } catch (error) {
    next()
  }
}
