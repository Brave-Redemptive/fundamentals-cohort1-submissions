import { UserRepository } from "../repositories/user.repository.js";
import { UserInput } from "../validators/user.validator.js";
import { ok, fail, Result } from "../lib/result.js";

export const userService = {
    createUser: async (data: UserInput): Promise<Result<any, { message: string; status: number }>> => {
     const existingUser = await UserRepository.findByEmail(data.email).catch(() => null);
    if (existingUser) {
      throw new Error("User already exists");
    }

    try {
      const user = await UserRepository.create(data);
      return ok(user);
    } catch (e) {
      return fail({ message: "Failed to create user", status: 500 });
    }   
 },

    getUsers: async(skip: number, take: number): Promise<Result<{ items: any[]; total: number }, { message: string; status: number }>> => {
        
        const users = await UserRepository.findAll(skip, take)
        if(!users) {
           return fail({ message: "Failed to get users", status: 500 });
        }
        return ok(users)
       
    },

    findUserById: async(id: string): Promise<Result<any, { message: string; status: number }>> => {
    const user = await UserRepository.findById(id);
    if (!user) {
      return fail({ message: "User not found", status: 404 });
    }
    return ok(user);
  },
    
}