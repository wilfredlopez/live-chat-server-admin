import {
  Arg,
  Args,
  ArgsType,
  Authorized,
  Ctx,
  Field,
  ID,
  Mutation,
  Publisher,
  PubSub,
  Query,
  Resolver,
  Root,
  Subscription,
} from "type-graphql"
import { Message, MessageInputType } from "../../entity/Message"
import { Notification, NotificationPayload } from "../../entity/Notification"
import { MyContext } from "../../schema/MyContext"
import { User } from "../../entity/User"
import { ObjectID, ObjectId } from "bson"
import { Guest } from "../../entity/Guest"

export const NEW_MESSAGE_NOTIFICATION = "NEW_MESSAGE_NOTIFICATION"
export const CHANNEL_MESSAGE_NOTIFICATION = "CHANNEL_MESSAGE_NOTIFICATION"

@ArgsType()
export class NewNotificationsArgs {
  @Field(type => ID)
  channelId: string
}

@Resolver(Message)
export class MessageResolver {
  //Cannot pass the entity or typescript type to the @mutation
  //need to create an object type. @ObjectType for this

  @Query(() => [Message])
  async getAllMessages(): Promise<Message[]> {
    const me = Message.find()

    // Message.delete({
    //   hasId: true,
    // })
    return me
  }

  @Mutation(returns => Message)
  @Authorized()
  async sendMessage(
    @Ctx() ctx: MyContext,
    @Arg("messageInput") input: MessageInputType,
    @PubSub(CHANNEL_MESSAGE_NOTIFICATION)
    publish: Publisher<NotificationPayload>,
  ): Promise<Message> {
    try {
      const { userId } = input
      // if(!userId){
      //     throw new Error
      // }
      //   const messageRepo = getMongoRepository(Message)
      const { channelId, text } = input

      //   const channel = await Channel.findOneOrFail(channelId)
      //   messageRepo.dropCollectionIndexes()
      const message = Message.create({
        message: text,
        channelId: channelId,
        userId: userId,
        date: new Date(Date.now()),
      })

      //   const channel = Channel.create<Channel>({ name: name, users: [] })

      await message.save()
      await publish({
        message: message.message,
        id: message.id,
        channelId: channelId,
        userId: userId,
      })

      return message
    } catch (e) {
      console.log(e)
      throw new Error(e)
    }
  }

  @Subscription(() => Notification, {
    topics: CHANNEL_MESSAGE_NOTIFICATION,
    // filter: ({ payload, args }) => args.priorities.includes(payload.priority),
  })
  async newMessageNotification(
    @Root() notificationPayload: NotificationPayload,
    // @Args() args: NewNotificationsArgs,
    @Ctx() ctx: MyContext,
  ): Promise<Notification> {
    //@ts-ignore
    const { userId } = notificationPayload
    if (userId) {
      let user: User | Guest | undefined

      user = await User.findOne(userId)

      if (!user) {
        user = await Guest.findOne(userId)
      }

      if (user) {
        return {
          ...notificationPayload,
          date: new Date(),
          user: user,
        }
      }
    }

    return {
      ...notificationPayload,
      date: new Date(),
      user: null,
    }
  }

  @Subscription(() => Notification, {
    topics: CHANNEL_MESSAGE_NOTIFICATION,
    filter: ({ payload, args }) => {
      return args.channelId === payload.channelId
    },
  })
  async channelMessageNotification(
    @Root() notificationPayload: NotificationPayload,
    @Args() args: NewNotificationsArgs,
  ): Promise<Notification> {
    const { userId } = notificationPayload
    if (userId) {
      let user: User | Guest | undefined

      user = await User.findOne(userId)

      if (!user) {
        user = await Guest.findOne(userId)
      }

      if (user) {
        return {
          ...notificationPayload,
          date: new Date(),
          user: user,
        }
      }
    }

    return {
      ...notificationPayload,
      date: new Date(),
      user: null,
    }
  }
}

export default MessageResolver
