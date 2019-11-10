import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  Publisher,
  PubSub,
} from "type-graphql"
import { Channel } from "../../entity/Channels"
import { Guest, GuestInputType } from "../../entity/Guest"
import { MyContext } from "../../schema/MyContext"
import { createGuestToken } from "../../utils/createToken"
import { SendCookies } from "../../utils/sendCookies"
import ChannelResolver from "../channels/channelResolver"
import { CHANNEL_MESSAGE_NOTIFICATION } from "../message/messageResolver"
import { NotificationPayload } from "../../entity/Notification"

@Resolver(Guest)
export class GuestResolver {
  @Mutation(() => Guest)
  async registerGuestOrLogin(
    @Arg("guestInputType")
    { email, firstname, lastname }: GuestInputType,
    @Ctx() ctx: MyContext,
    @PubSub(CHANNEL_MESSAGE_NOTIFICATION)
    publish: Publisher<NotificationPayload>,
  ): Promise<Guest> {
    try {
      const guest = await Guest.findOne({
        where: {
          email: email.toLowerCase(),
        },
      })
      if (guest) {
        guest.firstName = firstname
        guest.lastName = lastname
        await guest.save()
        const { accessToken, refreshToken } = createGuestToken(guest)

        SendCookies(ctx.res, accessToken, refreshToken)

        guest.token = accessToken
        await guest.save()

        await publish({
          message: "new channel created",
          id: guest.channelId as any,
          channelId: guest.channelId,
          userId: guest.id.toString(),
        })

        return guest //if guest alreay exists
      } else {
        const newChannel = await Channel.create({
          name: email.toLowerCase(),
          users: [],
        }).save()

        // console.log(newChannel.id)

        const guest = await Guest.create({
          email: email.toLowerCase(),
          firstName: firstname,
          lastName: lastname,
          count: 0,
          avatar:
            "https://cdn4.vectorstock.com/i/1000x1000/77/43/young-man-head-avatar-cartoon-face-character-vector-21757743.jpg",
        }).save()

        const { accessToken, refreshToken } = createGuestToken(guest)
        SendCookies(ctx.res, accessToken, refreshToken)

        guest.channelId = newChannel.id.toString()
        guest.token = accessToken

        await publish({
          message: newChannel.name,
          id: newChannel.id,
          channelId: newChannel.id.toString(),
          userId: guest.id.toString(),
        })

        // console.log(guest)

        await guest.save()

        return guest
      }
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  //just for dev
  @Query(returns => [Guest])
  async getAllGuests(@Ctx() {  }: MyContext): Promise<Array<Guest>> {
    const guests = await Guest.find()
    return guests
  }

  @Query(() => Guest, { nullable: true })
  async guestMe(@Ctx() ctx: MyContext): Promise<Guest | undefined> {
    // const request = ctx.req as any

    //@ts-ignore
    let { userId } = ctx.req

    if (!userId) {
      return undefined
    }

    // //@ts-ignore
    // if (!request.userId) {
    //   return undefined
    // }

    //do it with user id

    // const id = new ObjectID(userId)
    // const user = await ctx.userLoader.load(id as any)
    const user = await Guest.findOneOrFail(userId)
    // console.log(user)
    //do it with email
    // const user = await User.findOne({
    //   where: {
    //     email: request.email,
    //   },
    // })
    if (user) {
      return user
    } else {
      return undefined
    }
  }
}

export default GuestResolver
