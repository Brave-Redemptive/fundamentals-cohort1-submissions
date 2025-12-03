import User from "../models/User.js";

export const UserRepository = {
    async findByEmail(email: string){ return await User.findOne({email: email.toLowerCase()})},
    async findById(id: string){ return await User.findById(id)},
    async save(user: any){
        return await user.save()
    },
    async create(userData: any){
        const user = new User(userData);
        return await user.save()
    }

}