import bcrypt from "bcryptjs";
import { Arg, Ctx, Mutation, Query, Resolver, Authorized } from "type-graphql";
import { User, UserInputType, UserLoginInput } from "../../entity/User";
import { MyContext } from "../../schema/MyContext";
import { createToken } from "../../utils/createToken";
import { verify } from "jsonwebtoken";
import { SendCookies } from "../../utils/sendCookies";
import { ObjectID } from "bson";
import { getMongoRepository } from "typeorm";
import { JWT_SECRET } from "../../utils/env";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

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
          : "https://cdn4.vectorstock.com/i/1000x1000/77/43/young-man-head-avatar-cartoon-face-character-vector-21757743.jpg"
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
  async setAvailable(@Ctx() ctx: MyContext): Promise<boolean> {
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
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  }

  @Mutation(() => Boolean!)
  async setUnavailable(@Ctx() ctx: MyContext): Promise<boolean> {
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
  async logout(@Ctx() ctx: MyContext): Promise<Boolean> {
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
}

export default UserResolver;
