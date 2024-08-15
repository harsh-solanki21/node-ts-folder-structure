import User from "../models/user.model";
import { IUser, IUserInput } from "../interfaces/user";

export class UserRepository {
	async createUser(userData: IUserInput): Promise<IUser> {
		const user = new User(userData);
		return await user.save();
	}

	async findUserByEmail(email: string): Promise<IUser | null> {
		return await User.findOne({ email });
	}
}
