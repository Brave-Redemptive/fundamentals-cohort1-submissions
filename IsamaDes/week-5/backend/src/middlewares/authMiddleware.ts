import { NextFunction, Request, Response } from "express";
import Jwt, {JwtPayload} from "jsonwebtoken";
import { UserRepository } from "../repositories/userRepository.js";

export interface AuthRequest extends Request {
    user?: {
    _id: string,
    email: string,
    role: string
    }
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) =>{
      const token = req.cookies?.accessToken;

      if(!token){
        return res.status(401).json("User Not Authorised");
      }
      // use env to verify token was generated from this server
      const decoded = Jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      const decodedId = decoded?.id

      const user = await UserRepository.findById(decodedId);
      
      //pass user confirmed user into the request
      req.user = {_id: user?._id.toString(), email: user?.email, role: user?.role}
      

}