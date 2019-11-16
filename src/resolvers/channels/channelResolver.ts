import { ObjectId } from "bson";
import {
  Arg,
  Ctx,
  Mutation,
  Publisher,
  PubSub,
  Query,
  Resolver,
  Root,
  Subscription
} from "type-graphql";
import { getMongoRepository } from "typeorm";
import { NEW_CHANNEL_CREATED_NOTIFICATION } from "../../constants";
import { Channel } from "../../entity/Channels";
import { Guest } from "../../entity/Guest";
import { Notification, NotificationPayload } from "../../entity/Notification";
import { User } from "../../entity/User";
import { MyContext } from "../../schema/MyContext";

@Resolver(Channel)
export class ChannelResolver {
  //Cannot pass the entity or typescript type to the @mutation
  //need to create an object type. @ObjectType for this
  @Mutation(returns => Channel)
  async createChannel(
    @Ctx() ctx: MyContext,
    @Arg("name") name: string,
    @PubSub(NEW_CHANNEL_CREATED_NOTIFICATION)
    publish: Publisher<NotificationPayload>
  ): Promise<Channel> {
    try {
      const channelRepo = getMongoRepository(Channel);

      //   channelRepo.dropCollectionIndexes()
      const channel = channelRepo.create({ name: name, users: [] });
      //   const channel = Channel.create<Channel>({ name: name, users: [] })

      await channel.save();
      await publish({
        message: channel.name,
        id: channel.id,
        channelId: channel.id.toString(),
        userId: "system"
      });

      return channel;
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }

  @Query(() => [Channel])
  async getAllChannels(): Promise<Channel[]> {
    try {
      //   await this.recipeService.removeById(id);
      const channel = await Channel.find({});

      return channel;
    } catch (e) {
      throw new Error(e);
    }
  }

  @Subscription(() => Notification, {
    topics: NEW_CHANNEL_CREATED_NOTIFICATION
    // filter: ({ payload, args }) => args.priorities.includes(payload.priority),
  })
  async newChannelNotification(
    @Root() notificationPayload: NotificationPayload
    // @Args() args: NewNotificationsArgs,
    // @Ctx() ctx: MyContext
  ): Promise<Notification> {
    const { userId } = notificationPayload;
    if (userId) {
      let user: User | Guest | undefined;

      user = await User.findOne(userId);

      if (!user) {
        user = await Guest.findOne(userId);
      }

      if (user) {
        return {
          ...notificationPayload,
          date: new Date(),
          user: user
        };
      }
    }

    return {
      ...notificationPayload,
      date: new Date(),
      user: null
    };
  }
}

export default ChannelResolver;
