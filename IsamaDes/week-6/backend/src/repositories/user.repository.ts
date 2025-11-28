// why prisma
// prisma provides a type-safe ORM layer through compile time querry validation preventing runtime errors;
// Pure data-access layer.

// Talks directly to Prisma.

// Doesn’t care about validation — it trusts the service to send safe data.

import { UserInput, UserSchema } from "../validators/user.validator.js";
import {prisma} from "../lib/prisma.js"
import bcrypt from "bcryptjs"


export const UserRepository = {
  create: async (data: UserInput) => {
    try {
      console.log("data", data)
      // Validate and transform input using Zod
      const parsedData = UserSchema.parse(data);

       const hashedPassword = await bcrypt.hash(parsedData.password, 10);
      // Create user in DB
      const user = await prisma.user.create({
        data: {
          ...parsedData,
          email: parsedData.email.toLowerCase(),
          password: hashedPassword,
          subscription: parsedData.subscription ?? null,
          age: parsedData.age ?? null,
          healthGoal: parsedData.healthGoal ?? null,
          role: parsedData.role ?? "CLIENT",
          loginAttempts: parsedData.loginAttempts ?? 0,
          lockUntil: parsedData.lockUntil ?? null, 
        },
      });

      return user;
    } catch (err: any) {
      // Handle Zod validation errors or Prisma errors
      if (err.name === "ZodError") {
        throw new Error(
          `Validation error: ${JSON.stringify(err.errors)}`
        );
      }
      throw err;
    }
  },
    
   


  findAll: async(skip = 0, take = 20) => {
    const [items, total] = await Promise.all([
        prisma.user.findMany({skip, take, orderBy: {createdAt: 'desc'}}),
        prisma.user.count(),
    ])
    return {items, total}
  },
  findById: async(id: string) => {
    const user = await prisma.user.findUnique({where: {id}})
   if(!user){
        throw new Error(`User with ID ${id} not found`)
       }
   return user;
  },
  findByEmail: async(email: string) => { 
    return await prisma.user.findUniqueOrThrow({ where: { email: email.toLowerCase() },})},
  update: async(id: string, data: any) => {
    return await prisma.user.update({where: {id}, data,})
  },
  save: async(user: any) => {
    return await prisma.user.update({where: {id: user.id}, data: {...user, id: undefined}});
  }
}

