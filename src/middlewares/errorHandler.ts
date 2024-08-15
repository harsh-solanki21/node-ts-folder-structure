import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/customErrorHandler";
import { sendErrorResponse } from "../utils/customResponse";
import { StatusCodes } from "../constants/httpStatusCodes";

const errorHandler = (error: Error, req: Request, res: Response, _next: NextFunction) => {
	if (error instanceof AppError) {
		return sendErrorResponse(error, res);
	}

	const unexpectedError = new AppError(
		"InternalServerError",
		StatusCodes.INTERNAL_SERVER_ERROR,
		"An unexpected error occurred",
		false
	);

	const meta =
		process.env.NODE_ENV !== "production"
			? {
					originalError: {
						name: error.name,
						message: error.message,
						stack: error.stack
					},
					requestInfo: {
						method: req.method,
						url: req.url,
						headers: req.headers,
						body: req.body
					}
				}
			: undefined;

	return sendErrorResponse(unexpectedError, res, meta);
};

export default errorHandler;
