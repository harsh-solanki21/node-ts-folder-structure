import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../../src/app";
import { AUTH_MESSAGES } from "../../src/constants/messages";
import User from "../../src/models/user.model";

describe("Auth Routes", () => {
	let mongoServer: MongoMemoryServer;

	beforeAll(async () => {
		mongoServer = await MongoMemoryServer.create();
		const mongoUri = mongoServer.getUri();
		await mongoose.connect(mongoUri);
	});

	afterAll(async () => {
		await mongoose.disconnect();
		await mongoServer.stop();
	});

	beforeEach(async () => {
		await User.deleteMany({});
	});

	describe("POST /api/auth/register", () => {
		it("should register a new user", async () => {
			const response = await request(app).post("/api/auth/register").send({
				name: "Test User",
				email: "test@example.com",
				password: "password123"
			});

			expect(response.status).toBe(201);
			expect(response.body.message).toBe(AUTH_MESSAGES.REGISTRATION_SUCCESS);
			expect(response.body.userId).toBeDefined();

			const user = await User.findOne({ email: "test@example.com" });
			expect(user).toBeDefined();
			expect(user!.name).toBe("Test User");
		});

		it("should return error if user already exists", async () => {
			await User.create({
				name: "Existing User",
				email: "existing@example.com",
				password: "hashedpassword"
			});

			const response = await request(app).post("/api/auth/register").send({
				name: "Test User",
				email: "existing@example.com",
				password: "password123"
			});

			expect(response.status).toBe(400);
			expect(response.body.message).toBe(AUTH_MESSAGES.USER_ALREADY_EXISTS);
		});
	});

	describe("POST /api/auth/login", () => {
		beforeEach(async () => {
			await User.create({
				name: "Test User",
				email: "test@example.com",
				password: "$2a$10$testHashedPassword" // This should be a proper bcrypt hash in real scenario
			});
		});

		it("should login user and return token", async () => {
			const response = await request(app).post("/api/auth/login").send({
				email: "test@example.com",
				password: "password123"
			});

			expect(response.status).toBe(200);
			expect(response.body.message).toBe(AUTH_MESSAGES.LOGIN_SUCCESS);
			expect(response.body.token).toBeDefined();
		});

		it("should return error for invalid credentials", async () => {
			const response = await request(app).post("/api/auth/login").send({
				email: "test@example.com",
				password: "wrongpassword"
			});

			expect(response.status).toBe(400);
			expect(response.body.message).toBe(AUTH_MESSAGES.INVALID_CREDENTIALS);
		});
	});
});
