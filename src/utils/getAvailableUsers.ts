import { getMongoRepository } from "typeorm";
import { User } from "../entity/User";

export default async function getAvailableUsers() {
  const userRepo = getMongoRepository(User);

  return await userRepo.find({
    where: {
      "available.online": true
    },
    order: {
      chatsCount: "ASC"
    }
  });
}
