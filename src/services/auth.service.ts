import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../configs/index";
import { UserRepository } from "../repository/user.repository";
import { IUserInput } from "../interfaces/user";
import { AUTH_MESSAGES } from "../constants/index";

export class AuthService {
	private userRepository: UserRepository;

	constructor() {
		this.userRepository = new UserRepository();
	}

	async register(userData: IUserInput) {
		const existingUser = await this.userRepository.findUserByEmail(userData.email);
		if (existingUser) {
			throw new Error(AUTH_MESSAGES.USER_ALREADY_EXISTS);
		}

		const hashedPassword = await bcrypt.hash(userData.password, config.auth.bcryptSaltRounds);
		const newUser = await this.userRepository.createUser({
			...userData,
			password: hashedPassword
		});

		return { message: AUTH_MESSAGES.REGISTRATION_SUCCESS, userId: newUser.id };
	}

	async login(email: string, password: string) {
		const user = await this.userRepository.findUserByEmail(email);
		if (!user || !(await bcrypt.compare(password, user.password))) {
			throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
		}

		const token = jwt.sign({ userId: user.id }, config.auth.jwtSecret, {
			expiresIn: config.auth.jwtExpiresIn
		});

		return { message: AUTH_MESSAGES.LOGIN_SUCCESS, token };
	}
}
