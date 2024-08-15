import { StatusCodes } from "../constants/httpStatusCodes";
import { IValidationError } from "../interfaces/response";

export class AppError extends Error {
	readonly name: string;
	readonly statusCode: number;
	readonly isOperational: boolean;
	readonly validationErrors?: IValidationError[];
	readonly errorStack: boolean;

	constructor(
		name: string,
		statusCode: number,
		message: string,
		isOperational: boolean = true,
		validationErrors?: IValidationError[],
		errorStack: boolean = false
	) {
		super(message);
		Object.setPrototypeOf(this, new.target.prototype);
		this.name = name;
		this.statusCode = statusCode;
		this.isOperational = isOperational;
		this.validationErrors = validationErrors;
		this.errorStack = errorStack;
		if (this.errorStack) {
			Error.captureStackTrace(this);
		}
	}

	serialize() {
		return {
			name: this.name,
			message: this.message,
			statusCode: this.statusCode,
			isOperational: this.isOperational,
			validationErrors: this.validationErrors,
			stack: this.errorStack ? this.stack : undefined
		};
	}
}

export class BadRequest extends AppError {
	constructor(message = "Something went wrong!") {
		super("BadRequest", StatusCodes.BAD_REQUEST, message);
	}
}

export class Unauthorized extends AppError {
	constructor(message = "Access Denied!") {
		super("Unauthorized", StatusCodes.UNAUTHORIZED, message);
	}
}

export class NotFound extends AppError {
	constructor(message = "The page you are looking for doesn't exist!") {
		super("NotFound", StatusCodes.NOT_FOUND, message);
	}
}

export class ValidationError extends AppError {
	constructor(
		validationErrors: IValidationError[],
		message = "Validation Error!",
		isOperational = true,
		errorStack = false
	) {
		super("ValidationError", StatusCodes.UNPROCESSABLE_ENTITY, message, isOperational, validationErrors, errorStack);
	}
}

export class InternalServerError extends AppError {
	constructor(message = "Internal Server Error!") {
		super("InternalServerError", StatusCodes.INTERNAL_SERVER_ERROR, message);
	}
}
