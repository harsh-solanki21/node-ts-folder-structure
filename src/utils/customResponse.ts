import { Response } from "express";
import { StatusCodes } from "../constants/httpStatusCodes";
import { ISuccessResponse, IErrorResponse, IPaginationData, IMetaData } from "../interfaces/response";
import { AppError } from "./customErrorHandler";

export const sendSuccessResponse = <T>(
	res: Response,
	message: string,
	data: T,
	statusCode: number = StatusCodes.OK,
	meta?: IPaginationData | IMetaData
): void => {
	const response: ISuccessResponse<T> = {
		success: true,
		code: statusCode,
		message,
		data,
		meta
	};
	res.status(statusCode).json(response);
};

export const sendErrorResponse = (error: AppError, res: Response, meta?: IMetaData): void => {
	const { statusCode, message, validationErrors } = error;
	const code = statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
	const response: IErrorResponse = {
		success: false,
		code,
		message,
		errors: validationErrors || [],
		stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
		meta
	};
	res.status(code).json(response);
};
