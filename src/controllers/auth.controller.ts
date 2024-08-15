import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
	private authService: AuthService;

	constructor() {
		this.authService = new AuthService();
	}

	async register(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await this.authService.register(req.body);
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	}

	async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password } = req.body;
			const result = await this.authService.login(email, password);
			res.json(result);
		} catch (error) {
			next(error);
		}
	}
}
