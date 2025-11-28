import type{ Response} from "express";
import bcrypt from "bcryptjs";
import jwt from  "jsonwebtoken";
import sendAuthCookies from "../../utils/cookiesStore.js";
import { UserRepository } from "../../repositories/user.repository.js";
import { ok, fail, Result } from "../../lib/result.js";


const LOCK_TIME = 30 * 60 * 1000; // 30 minutes in ms
const MAX_ATTEMPTS = 3;


type LoginError = {
  message: string;
  status: number;
};


const loginUser = async (email: string, password: string, res: Response): Promise<Result<any, LoginError>>=> {
  

  if (!email || !password) {return fail ({message: "Email and password required", status: 400 })};
  const user = await UserRepository.findByEmail(email);
  if (!user) {
    return fail({ message: "User not found", status: 404 });
  }

  //Check if account is locked
    if (user.lockUntil && user.lockUntil.getTime() > Date.now()) {
    const minutesLeft = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
     return fail({
      message: `Account locked. Try again in ${minutesLeft} minutes`,
      status: 403,
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    // Increment failed attempts
    user.loginAttempts = (user.loginAttempts || 0) + 1;

    // Lock if attempts exceed max
    if (user.loginAttempts >= MAX_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOCK_TIME);
      user.loginAttempts = 0; // reset count after locking
    }
      await UserRepository!.save(user);
    return fail({ message: "Invalid credentials", status: 401 });
  }
    
  // Reset failed attempts if successful
  user.loginAttempts = 0;
  user.lockUntil = null as any;


  await UserRepository!.update(user.id, { loginAttempts: 0, lockUntil: null });

  const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: "30m",
  });
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" } 
  );

// Store tokens in secure cookies
  sendAuthCookies(res, accessToken, refreshToken);

  return ok ({
  
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
  
  });
};

export default  loginUser;

