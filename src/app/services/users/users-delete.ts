import { AppError } from "@/app/error";
import { IUserRequest } from "@/app/interfaces/users-interfaces";
import { UsersRepository } from "@/app/repositories/users-repository";
import { PrismaUsersRepository } from "@/infra/database/repositories/prisma-users-repository";

export const userDeleteService = async (
  userId: string,
  usersRepository: UsersRepository = new PrismaUsersRepository()
) => {
  const user = await usersRepository.findById(userId);
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  return await usersRepository.delete(userId);
};
