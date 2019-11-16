import { ObjectType, Field, ID } from "type-graphql";
import { ObjectID } from "typeorm";
import { User } from "./User";
import { Guest } from "./Guest";

@ObjectType()
export class Notification {
  @Field(type => ID, { description: "This is the Channel ID" })
  id: ObjectID;

  @Field()
  message: string;

  @Field(type => String!)
  channelId: string;

  @Field(type => Date)
  date: Date;

  // @Field(type => User, { nullable: true })
  // user?: User | Guest
  @Field(type => User, { nullable: true })
  user: User | Guest | null;
}

export interface NotificationPayload {
  id: ObjectID;
  message: string;
  channelId: string;
  userId: string;
}
