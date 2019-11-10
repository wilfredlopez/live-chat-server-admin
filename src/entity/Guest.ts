import { Entity, ObjectIdColumn, ObjectID, Column, BaseEntity } from "typeorm"
import {
  Field,
  ID,
  InputType,
  ObjectType,
  Root,
  Query,
  Ctx,
} from "type-graphql"
import { Length, IsEmail, IsUrl } from "class-validator"
import { Channel } from "./Channels"
import { MyContext } from "../schema/MyContext"

@InputType()
export class GuestInputType {
  @Field(() => String!)
  @IsEmail()
  email: string

  @Field({ nullable: true })
  @Length(1, 20)
  firstname?: string
  @Field({ nullable: true })
  @Length(1, 20)
  lastname?: string

  @Field({ nullable: true })
  @Length(1, 20)
  @IsUrl()
  avatar?: string
}

@ObjectType() //Make it an Object type for type-graphql
@Entity() //Make it an Entity for mongodb and typeorm
export class Guest extends BaseEntity {
  @Field(() => ID) //this is for the Graphql schema to understand
  @ObjectIdColumn() //this is for mongodb and typeorm to understand
  id: ObjectID

  @Field({ nullable: true }) //not all types are recognized by Graphql but strings  are fine
  @Column()
  firstName?: string

  @Field({ nullable: true })
  @Column()
  lastName?: string

  @Field(() => String)
  @Column()
  channelId: string

  @Field()
  // @Unique("User", ["email"])
  @Column({ unique: true, nullable: false })
  email: string

  @Field(() => String!, {
    defaultValue:
      "https://cdn4.vectorstock.com/i/1000x1000/77/43/young-man-head-avatar-cartoon-face-character-vector-21757743.jpg",
  })
  @Column({
    default:
      "https://cdn4.vectorstock.com/i/1000x1000/77/43/young-man-head-avatar-cartoon-face-character-vector-21757743.jpg",
  })
  avatar: string

  //this field is only availalbe in the graphql but not in the database so i dont create a column
  //is a custom field that we create and return info in api. we can also create a field resolver "@FieldResolver()" for it the UserResolver for this example.
  @Field()
  name(@Root() parent: Guest): string {
    return parent.firstName + " " + parent.lastName
  }

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  token: string

  @Field(() => Number, { defaultValue: 0 })
  @Column({ default: 0 })
  count: number

  @Field(() => Channel)
  channel(@Root() parent: Guest): Promise<Channel | undefined> {
    const id = new ObjectID(parent.channelId)
    const channel = Channel.findOne(id as any)
    return channel
  }
}
