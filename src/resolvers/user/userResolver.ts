import bcrypt from "bcryptjs";
import { ObjectID } from "bson";
import Gravatar from "gravatar";
import { verify } from "jsonwebtoken";
import {
  Arg,
  Authorized,
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
import {
  ACCESS_TOKEN,
  AVAILABLE_USERS_NOTIFICATION,
  REFRESH_TOKEN
} from "../../constants";
import {
  AvailableUsersNotification,
  AvailableUsersPayload
} from "../../entity/Notification";
import { User, UserInputType, UserLoginInput } from "../../entity/User";
import { MyContext } from "../../schema/MyContext";
import { createToken } from "../../utils/createToken";
import { JWT_SECRET } from "../../utils/env";
import getAvailableUsers from "../../utils/getAvailableUsers";
import { SendCookies } from "../../utils/sendCookies";

@Resolver(User)
export class UserResolver {
  //Cannot pass the entity or typescript type to the @mutation
  //need to create an object type. @ObjectType for this
  @Mutation(returns => User)
  async register(
    @Arg("userData")
    { email, password, lastname, firstname, avatar }: UserInputType
  ): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      //   await this.recipeService.removeById(id);

      const gravatar = Gravatar.url(email.toLowerCase());
      const user = await User.create({
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName: firstname,
        lastName: lastname,
        count: 0,
        confirmed: false,
        channels: ["general"],
        available: {
          online: false,
          time: new Date(Date.now())
        },
        chatsCount: 0,
        maxChatsAtATime: 3,
        avatar: avatar
          ? avatar
          : gravatar ||
            "https://cdn4.vectorstock.com/i/1000x1000/77/43/young-man-head-avatar-cartoon-face-character-vector-21757743.jpg"
      }).save();

      return user;
    } catch (e) {
      throw new Error(e);
    }
  }

  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("loginData")
    { email, password }: UserLoginInput,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const r = getMongoRepository(User);

    // await r.dropCollectionIndexes()
    // // r.dropCollectionIndexes()
    try {
      const user = await r.findOne({
        where: {
          email: email.toLowerCase()
        }
      });
      if (user) {
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
          throw new Error("Invalid Password"); //if password is not valid
        }

        //TODO: I NEED TO FIX THIS WHEN I ADD EMAIL CONFIRMATION
        // if (!user.confirmed) {
        //   throw new Error("Not Confirmed. Please confirm your email address") //if password is not valid
        // }

        const { accessToken, refreshToken } = createToken(user);

        SendCookies(ctx.res, accessToken, refreshToken);

        user.token = accessToken;
        await user.save();

        return user; //if password is valid
      }
      return null;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  @Mutation(() => Boolean!)
  async setAvailable(
    @Ctx() ctx: MyContext,
    @PubSub(AVAILABLE_USERS_NOTIFICATION)
    publish: Publisher<AvailableUsersPayload>
  ): Promise<boolean> {
    //@ts-ignore
    if (!ctx.req.userId) {
      return false;
    } else {
      try {
        //@ts-ignore
        const id = new ObjectID(ctx.req.userId);
        const user = await ctx.userLoader.load(id as any);

        if (!user) {
          return false;
        }

        user.available = {
          online: true,
          time: new Date(Date.now())
        };
        await user.save();

        const availableUsers = await getAvailableUsers();

        publish({
          users: availableUsers
        });

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  }

  @Mutation(() => Boolean!)
  async setUnavailable(
    @Ctx() ctx: MyContext,
    @PubSub(AVAILABLE_USERS_NOTIFICATION)
    publish: Publisher<AvailableUsersPayload>
  ): Promise<boolean> {
    //@ts-ignore
    const { userId } = ctx.req;
    if (!userId) {
      return false;
    } else {
      try {
        const id = new ObjectID(userId);
        const user = await ctx.userLoader.load(id as any);
        if (!user) {
          return false;
        }

        user.available = {
          online: false,
          time: new Date(Date.now())
        };
        await user.save();

        const availableUsers = await getAvailableUsers();

        publish({
          users: availableUsers
        });

        return true;
      } catch (error) {
        return false;
      }
    }
  }
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    // const request = ctx.req as any

    //@ts-ignore
    let { userId } = ctx.req;

    if (!userId) {
      return undefined;
    }

    // //@ts-ignore
    // if (!request.userId) {
    //   return undefined
    // }

    //do it with user id

    const id = new ObjectID(userId);
    const user = await ctx.userLoader.load(id as any);
    // const user = await User.findOneOrFail(userId)

    //do it with email
    // const user = await User.findOne({
    //   where: {
    //     email: request.email,
    //   },
    // })
    if (user) {
      return user;
    } else {
      return undefined;
    }
  }

  @Mutation(() => Boolean)
  async logout(
    @Ctx() ctx: MyContext,
    @PubSub(AVAILABLE_USERS_NOTIFICATION)
    publish: Publisher<AvailableUsersPayload>
  ): Promise<Boolean> {
    try {
      //@ts-ignore
      let { userId } = ctx.req;
      const id = new ObjectID(userId);
      const user = await ctx.userLoader.load(id as any);
      user.available = {
        online: false,
        time: new Date(Date.now())
      };
      await user.save();
      const availableUsers = await getAvailableUsers();

      publish({
        users: availableUsers
      });
    } catch (error) {}

    ctx.res.clearCookie(ACCESS_TOKEN);
    ctx.res.clearCookie(REFRESH_TOKEN);

    return true;
  }

  @Mutation(() => Boolean)
  async confirmUser(@Arg("token") token: string): Promise<Boolean> {
    const verified = verify(token, JWT_SECRET!) as any;

    if (!verified.userId) {
      return false;
    }
    const user = await User.findOneOrFail({ id: verified.userId });
    if (!user) {
      return false;
    }

    user.confirmed = true;
    await user.save();

    return true;
  }

  @Authorized() //only authorized members can access
  @Query(() => Boolean, { nullable: true })
  async AmIAuthorized(@Ctx() ctx: MyContext): Promise<boolean | null> {
    //@ts-ignore
    const id = ctx.req.userId;

    if (!id) {
      return null;
    }
    return true;
  }

  //just for dev
  @Query(returns => [User])
  async getAllUsers(@Ctx() {}: MyContext) {
    const users = await User.find();
    return users;
  }

  @Query(returns => [User])
  async queryAvailableUsers(@Ctx() {}: MyContext) {
    return getAvailableUsers();
  }

  @Subscription(() => AvailableUsersNotification, {
    topics: AVAILABLE_USERS_NOTIFICATION
    // filter: ({ payload, args }) => args.priorities.includes(payload.priority),
  })
  async availableUsers(
    @Root() availableUsersPayload: AvailableUsersPayload
    // @Args() args: NewNotificationsArgs,
    // @Ctx() ctx: MyContext
  ): Promise<AvailableUsersNotification> {
    return {
      ...availableUsersPayload
    };
  }
}

export default UserResolver;
