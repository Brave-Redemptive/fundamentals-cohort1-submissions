import User from "../models/User";

export const tokenRepository = {
      async blacklistedToken(refreshToken: string, expiresAt: Date){
            const user = new User({token: refreshToken, expiresAt});
            return await user.save();
        },
}