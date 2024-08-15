import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../configs/index";
import { Unauthorized } from "../utils/customErrorHandler";
import { IUser } from "../interfaces/user";

declare global {
	namespace Express {
		interface Request {
			user?: IUser;
		}
	}
}

export const authenticateJWT = (req: Request, _res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	if (authHeader) {
		const token = authHeader.split(" ")[1];

		jwt.verify(token, config.auth.jwtSecret, (err, user) => {
			if (err) {
				throw new Unauthorized();
			}

			req.user = user as IUser;
			next();
		});
	} else {
		throw new Unauthorized();
	}
};
