import DataLoader from "dataloader"
import { User } from "../entity/User"
import { ObjectID } from "typeorm"

//ts already infers the type but if i want to explicit this is the type definition
type BatchGetUsersType = (keys: string[]) => Promise<User[]>

export const userLoader = () =>
  new DataLoader<ObjectID, User>(keys => {
    return batchGetUsers(keys)
  })

async function batchGetUsers(ids: ObjectID[]) {
  const users = await User.findByIds(ids, {
    cache: true,
  })

  //   console.log(users)

  //users returns:
  //[{id: 'asds', email:'myemail@user.com'}, {id: 'asds', email:'myemail@user.com'}]

  //dataLoader expects:
  // [id1: {id: "id1", email: "user1@email.com"}, id2: {id: "id1", email: "user1@email.com"}]
  const userMap: { [key: string]: User } = {}

  users.forEach(user => {
    userMap[user.id.toString()] = user
  })

  return ids.map(id => userMap[id.toString()])
}
