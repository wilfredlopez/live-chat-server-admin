import { Entity, ObjectIdColumn, ObjectID, Column, BaseEntity } from "typeorm"
import {
  Field,
  ID,
  InputType,
  ObjectType,
  Root,
  FieldResolver,
} from "type-graphql"
import { Length, IsEmail, IsUrl } from "class-validator"
import { isEmailAlreadyExist } from "../resolvers/user/isEmailAlreadyExist"
import { Channel } from "./Channels"

@InputType()
export class UserInputType {
  @Field(() => String!)
  @IsEmail()
  @isEmailAlreadyExist({ message: "User already Exists" }) //THIS IS MY CUSTOM DECORATOR
  email: string
  @Field()
  @Length(5, 60, {
    message: "Password most be from 5 to 60 characters lenght",
  })
  password: string
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

@InputType()
export class UserLoginInput {
  @Field(() => String!)
  @IsEmail()
  email: string
  @Field()
  @Length(5, 60, {
    message: "Password most be from 5 to 60 characters lenght",
  })
  password: string
}

@ObjectType()
class Available {
  @Field(() => Boolean!, { defaultValue: false })
  online: boolean
  @Field(() => Date!, { defaultValue: new Date(Date.now()) })
  time: Date
}

@ObjectType() //Make it an Object type for type-graphql
@Entity() //Make it an Entity for mongodb and typeorm
export class User extends BaseEntity {
  @Field(() => ID) //this is for the Graphql schema to understand
  @ObjectIdColumn() //this is for mongodb and typeorm to understand
  id: ObjectID

  @Field({ nullable: true }) //not all types are recognized by Graphql but strings  are fine
  @Column()
  firstName?: string

  @Field({ nullable: true })
  @Column()
  lastName?: string

  @Field(() => Boolean!, { defaultValue: false })
  @Column({ default: false })
  admin: string

  @Field(() => [String], { nullable: true })
  @Column()
  channels: [String]

  @Field(() => Available, { nullable: false })
  @Column({ nullable: false })
  available: Available

  @Field(() => Number, { defaultValue: 0 })
  @Column({ default: 0 })
  chatsCount: number

  @Field(() => String!, {
    defaultValue:
      "https://cdn4.vectorstock.com/i/1000x1000/77/43/young-man-head-avatar-cartoon-face-character-vector-21757743.jpg",
  })
  @Column({
    default:
      "https://cdn4.vectorstock.com/i/1000x1000/77/43/young-man-head-avatar-cartoon-face-character-vector-21757743.jpg",
  })
  avatar: string

  @Field(() => Number, { defaultValue: 3 })
  @Column({ default: 3 })
  maxChatsAtATime: number

  @Field(() => Boolean)
  isAvailable(@Root() parent: User): boolean {
    return parent.available.online && parent.maxChatsAtATime > parent.chatsCount
  }

  @Field()
  // @Unique("User", ["email"])
  @Column({ unique: true, nullable: false })
  email: string

  @Field(() => Number, { defaultValue: 0 })
  @Column({ default: 0 })
  count: number

  //dont add field in order to no see it or return it in the Graphql api
  @Column({ nullable: false })
  password: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  token: string

  @Field(() => Boolean)
  @Column({ default: false })
  confirmed: boolean

  //this field is only availalbe in the graphql but not in the database so i dont create a column
  //is a custom field that we create and return info in api. we can also create a field resolver "@FieldResolver()" for it the UserResolver for this example.
  @Field()
  name(@Root() parent: User): string {
    return parent.firstName + " " + parent.lastName
  }
}
