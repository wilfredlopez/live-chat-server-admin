import { User } from "../entity/User"
import { sign } from "jsonwebtoken"
import { JWT_SECRET, FRONTEND_URL } from "./env"

export const createConfirmationUrl = async (
  userId: string,
): Promise<string> => {
  const user = await User.findOneOrFail({ id: userId })
  const token = sign(
    { userId: userId, email: user.email, count: user.count },
    JWT_SECRET!,
    {
      expiresIn: "1day",
    },
  )

  user.token = token

  await user.save()
  return `${FRONTEND_URL}/user/confirm/${token}`
}
