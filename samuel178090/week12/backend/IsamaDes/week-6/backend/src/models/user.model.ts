//zod helps in validation and parses actual data in req
//compile time safety, static typing and autocompletion when i use inferred type User at compile time
//
// src/models/user.model.ts
import {prisma} from "../lib/prisma.js"

export const UserModel = prisma.user;
