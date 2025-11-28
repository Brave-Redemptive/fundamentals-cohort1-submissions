import type { Response } from "express";
import bcrypt from "bcryptjs";
import validateRegistrationInput from "../../utils/validation.js";
import { UserRepository } from "../../repositories/user.repository.js";
import { UserSchema } from "../../validators/user.validator.js";
import { ok, fail, Result } from "../../lib/result.js";

type RegisterError = {
  message: string;
  status: number;
};

const registerUser = async (name: string, email: string, password: string, role: string, res: Response ): Promise<Result<any, RegisterError>> => {

  const { valid, errors, sanitized } = validateRegistrationInput({
    name,
    email,
    password,
  });

   if (!valid) {
    return fail({ message: errors.join(" "), status: 400 });
  }

  const cleanEmail = sanitized.email

  const existing = await UserRepository.findByEmail(cleanEmail);

  if (existing) return fail({ message: "User already exists", status: 409 });

  const hashed = await bcrypt.hash(sanitized.password, 10);

  const parsedData = UserSchema.parse({
  ...sanitized,
  email: cleanEmail,
  password: hashed,
});


const user = await UserRepository.create(parsedData);


console.log("Registration successful for:", user.email, user.id);

  return ok({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});
  
};

export default registerUser;
