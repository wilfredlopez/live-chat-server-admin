import {
  Entity,
  ObjectIdColumn,
  Column,
  BaseEntity,
  OneToOne,
  ManyToOne,
  ObjectID as typeOrmObjectId,
} from "typeorm"
import { Field, ID, ObjectType, InputType, Root, Ctx } from "type-graphql"
import { User } from "./User"
import { Channel } from "./Channels"
import { MyContext } from "../schema/MyContext"
import { ObjectID } from "bson"
import { Guest } from "./Guest"

@InputType()
export class MessageInputType {
  @Field()
  text: string
  @Field()
  channelId: string
  @Field()
  userId: string
}

@ObjectType() //Make it an Object type for type-graphql
@Entity() //Make it an Entity for mongodb and typeorm
export class Message extends BaseEntity {
  @Field(() => ID) //this is for the Graphql schema to understand
  @ObjectIdColumn() //this is for mongodb and typeorm to understand
  id: typeOrmObjectId

  @Field(() => String!) //not all types are recognized by Graphql but strings  are fine
  @Column()
  message: string

  @Field()
  @Column()
  userId: string

  @Field()
  @Column()
  channelId: string

  @Field()
  @Column()
  date: Date

  @Field(() => User, { nullable: true })
  async user(
    @Root() parent: Message,
    @Ctx() ctx: MyContext,
  ): Promise<User | Guest | undefined> {
    const id = new ObjectID(parent.userId)
    // console.log(parent.userId)
    const user = await ctx.userLoader.load(id as any)
    if (user) {
      return user
    } else {
      const guest = Guest.findOneOrFail(parent.userId)
      return guest
    }
  }

  @Field(() => Channel)
  channel(@Root() parent: Message): Promise<Channel | undefined> {
    const id = new ObjectID(parent.channelId)
    const channel = Channel.findOne(id as any)
    return channel
  }
}
