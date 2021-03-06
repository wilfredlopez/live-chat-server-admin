import {
  Resolver,
  Query,
  Mutation,
  Arg,
  InputType,
  Field,
  Ctx,
} from "type-graphql"
import { User } from "../../entity/User"
import bcrypt from "bcryptjs"
import { MyContext } from "../../schema/MyContext"
// import { v4 } from "uuid"
import jwt from "jsonwebtoken"

// import { forgetPasswordPrefix } from "../../constants/redixPrefixes"
import sendEmail from "../../utils/sendEmail"
import { createToken } from "../../utils/createToken"
import { ObjectID } from "bson"
import { SendCookies } from "../../utils/sendCookies"
import { JWT_SECRET, FRONTEND_URL } from "../../utils/env"

let secret: string
if (process.env.NODE_ENV === "production") {
  secret = process.env.JWT_SECRET as any
} else {
  secret = JWT_SECRET!
}

@InputType()
class ChangePasswordInputType {
  @Field()
  token: string
  @Field()
  password: string
}

@Resolver(User)
export class ChangeForgotPasswordResolver {
  @Query(() => String!)
  async test() {
    return "Hello Woruld"
  }
  //TODO: 'fix'
  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg("data") data: ChangePasswordInputType,
    @Ctx() ctx: MyContext,
  ): Promise<User | null> {
    try {
      //TODO: FIND A WAY TO GET TOKEN OR SOMETHING FROM THE CONTEXT
      //for now ill do this
      const userId = await jwt.verify(data.token, secret)

      if (!userId) {
        return null
      }
      const id = new ObjectID(userId as any)
      const user = await ctx.userLoader.load(id as any)
      // let user = await User.findOne({ id: userId })

      if (!user) {
        return null
      }

      user.password = await bcrypt.hash(data.password, 10)
      await user.save()

      const tokens = createToken(user)

      // const hour = 3600000

      SendCookies(ctx.res, tokens.refreshToken, tokens.accessToken)

      // ctx.res.cookie("refresh-token", tokens.refreshToken, {
      //   expires: true,
      //   maxAge: 14 * 24 * hour, //2 weeks
      // })

      // ctx.res.cookie("access-token", tokens.accessToken, {
      //   expires: true,
      //   maxAge: 24 * hour, //24 hours
      // })

      return user
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }
  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<Boolean> {
    const user = await User.findOne({ email: email })

    if (!user) {
      return false
    }

    const jwtToken = jwt.sign(user.id, secret, {
      expiresIn: "24h",
    })

    //ALTERNATIVE WAY> SETTING TOKEN . LATER I WILL HAVE TO SEND EMAIL WITH TOKEN SO THEY CAN CONFIRM
    user.token = jwtToken
    await user.save()

    await sendEmail({
      to: email,
      url: `${FRONTEND_URL}/user/change-password/${jwtToken}`,
    })

    return true
  }

  @Mutation(() => Boolean)
  async invalidateTokens(@Ctx() ctx: MyContext): Promise<boolean> {
    const request = ctx.req as any

    if (!request.userId) {
      if (!request.session.userId) {
        return false
      }
    }

    let { userId } = request

    if (!userId) {
      //@ts-ignore
      userId = request.session.userId
    }

    try {
      const id = new ObjectID(userId)
      const user = await ctx.userLoader.load(id as any)
      // const user = await User.findOneOrFail(userId)

      if (!user) {
        return false
      }

      user.count += 1
      await user.save()
      return true
    } catch (error) {
      return false
    }
  }
}

export default ChangeForgotPasswordResolver
