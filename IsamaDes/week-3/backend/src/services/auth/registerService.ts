import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import genrateTokenAndHash from "../../utils /tokenUtils.js";

import validateRegistrationInput from "../../utils /validate.js";


const registerUser = async (name: string, email: string, password: string, role: string) => {

  const { valid, errors, sanitized } = validateRegistrationInput({
    name,
    email,
    password,
  });

   if (!valid) {
    throw new Error(errors.join(" "));
  }

  const cleanEmail = sanitized.email.toLowerCase();

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new Error("User already exists");

  const hashed = await bcrypt.hash(sanitized.password, 10);

  const { token, tokenHash } = genrateTokenAndHash();

  const user = new User({
    name: sanitized.name,
    email: cleanEmail,
    password: hashed,
    role,
    tokenHash,
    tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  await user.save();

  return {
  
  id: user._id,
  email: user.email,
  role: user.role,
  token,

};
  
};

export default registerUser;
