import { Entity, ObjectIdColumn, ObjectID, Column, BaseEntity } from "typeorm"
import { Field, ID, ObjectType } from "type-graphql"

@ObjectType() //Make it an Object type for type-graphql
@Entity() //Make it an Entity for mongodb and typeorm
export class Channel extends BaseEntity {
  @Field(() => ID) //this is for the Graphql schema to understand
  @ObjectIdColumn() //this is for mongodb and typeorm to understand
  id: ObjectID

  @Field(() => String!, { nullable: false }) //not all types are recognized by Graphql but strings  are fine
  @Column({ primary: true })
  name: string

  @Field(() => [String!], { nullable: true })
  @Column({ nullable: true })
  users?: [string]
}
