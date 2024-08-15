import express, { Express } from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import notFoundHandler from "./middlewares/notFoundHandler";
import errorHandler from "./middlewares/errorHandler";
import loadRoutes from "./routes/index.routes";
import { Unauthorized } from "./utils/customErrorHandler";

dotenv.config();
const app: Express = express();
app.use(cookieParser(process.env.JWT_SECRET));

const whitelist: string[] = JSON.parse(process.env.CORS_ORIGIN || "[]");

const corsOptions: CorsOptions = {
	origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
		if (!origin || whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Unauthorized("Not allowed by CORS"));
		}
	},
	credentials: true,
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
};

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(helmet());
app.use(compression());
app.use(cors(corsOptions));
app.options("*", cors());

// routes
loadRoutes(app);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };

// =========== Class based Implementation ==========
// class App {
// 	public app: Application;
// 	private whitelist: string[];
// 	private corsOptions: CorsOptions;

// 	constructor() {
// 		dotenv.config();
// 		this.app = express();
// 		this.whitelist = JSON.parse(process.env.CORS_ORIGIN || "[]");
// 		this.corsOptions = this.configureCorsOptions();
// 		this.configureMiddleware();
// 		this.configureRoutes();
// 		this.configureErrorHandling();
// 	}

// 	private configureCorsOptions(): CorsOptions {
// 		return {
// 			origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
// 				if (!origin || this.whitelist.indexOf(origin) !== -1) {
// 					callback(null, true);
// 				} else {
// 					callback(new Unauthorized("Not allowed by CORS"));
// 				}
// 			},
// 			credentials: true,
// 			methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
// 		};
// 	}

// 	private configureMiddleware(): void {
// 		this.app.use(cookieParser(process.env.JWT_SECRET));
// 		this.app.use(express.json({ limit: "16kb" }));
// 		this.app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// 		this.app.use(helmet());
// 		this.app.use(compression());
// 		this.app.use(cors(this.corsOptions));
// 		this.app.options("*", cors());
// 	}

// 	private configureRoutes(): void {
// 		loadRoutes(this.app);
// 	}

// 	private configureErrorHandling(): void {
// 		this.app.use(notFoundHandler);
// 		this.app.use(errorHandler);
// 	}
// }

// export const app = new App().app;
