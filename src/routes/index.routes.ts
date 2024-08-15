import { Express } from "express";
import authRoutes from "./auth.routes";

const loadRoutes = (app: Express) => {
	app.use("/api/v1/auth", [], authRoutes);
	app.use("/api/v1/user", [], authRoutes);
};

export default loadRoutes;
