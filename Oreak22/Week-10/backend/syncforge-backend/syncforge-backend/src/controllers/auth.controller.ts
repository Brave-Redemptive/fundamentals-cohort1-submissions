import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import { generateToken } from "../utils/generateToken";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).send({ message: "All fields are required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).send({ message: "Email already in use" });
    
    console.log("register attempt:", req.body);
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    return res.status(201).send({
      message: "Registration successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    return res.status(500).send({ message: "Server error", err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", req.body);

    if (!email || !password)
      return res.status(400).send({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send({ message: "Invalid credentials" });

    const token = generateToken(user._id.toString());

    return res.status(200).send({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    return res.status(500).send({ message: "Server error", err });
  }
};
