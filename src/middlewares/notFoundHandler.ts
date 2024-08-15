import { NextFunction, Request, Response } from "express";
import { NotFound } from "../utils/customErrorHandler";

const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
	next(new NotFound());
};

export default notFoundHandler;
