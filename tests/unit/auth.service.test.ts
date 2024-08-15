import { AuthService } from "../../../src/services/auth.service";
import { UserRepository } from "../../../src/repository/user.repository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../../src/configs/config";
import { AUTH_MESSAGES } from "../../../src/constants/messages";

jest.mock("../../../src/repository/user.repository");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
	let authService: AuthService;
	let mockUserRepository: jest.Mocked<UserRepository>;

	beforeEach(() => {
		mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
		authService = new AuthService();
		(authService as any).userRepository = mockUserRepository;
	});

	describe("register", () => {
		it("should register a new user successfully", async () => {
			const userData = { name: "Test User", email: "test@example.com", password: "password123" };
			const hashedPassword = "hashedPassword";
			const newUser = { id: "user123", ...userData, password: hashedPassword };

			mockUserRepository.findUserByEmail.mockResolvedValue(null);
			mockUserRepository.createUser.mockResolvedValue(newUser);
			(bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

			const result = await authService.register(userData);

			expect(result).toEqual({ message: AUTH_MESSAGES.REGISTRATION_SUCCESS, userId: "user123" });
			expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(userData.email);
			expect(mockUserRepository.createUser).toHaveBeenCalledWith({ ...userData, password: hashedPassword });
		});

		it("should throw an error if user already exists", async () => {
			const userData = { name: "Test User", email: "test@example.com", password: "password123" };
			mockUserRepository.findUserByEmail.mockResolvedValue({ id: "existingUser", ...userData } as any);

			await expect(authService.register(userData)).rejects.toThrow(AUTH_MESSAGES.USER_ALREADY_EXISTS);
		});
	});

	describe("login", () => {
		it("should login user and return token", async () => {
			const userData = { id: "user123", email: "test@example.com", password: "hashedPassword" };
			const token = "jwt_token";

			mockUserRepository.findUserByEmail.mockResolvedValue(userData as any);
			(bcrypt.compare as jest.Mock).mockResolvedValue(true);
			(jwt.sign as jest.Mock).mockReturnValue(token);

			const result = await authService.login(userData.email, "password123");

			expect(result).toEqual({ message: AUTH_MESSAGES.LOGIN_SUCCESS, token });
			expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(userData.email);
			expect(jwt.sign).toHaveBeenCalledWith({ userId: userData.id }, config.jwtSecret, {
				expiresIn: config.jwtExpiresIn
			});
		});

		it("should throw an error if credentials are invalid", async () => {
			mockUserRepository.findUserByEmail.mockResolvedValue(null);

			await expect(authService.login("test@example.com", "password123")).rejects.toThrow(
				AUTH_MESSAGES.INVALID_CREDENTIALS
			);
		});
	});
});
