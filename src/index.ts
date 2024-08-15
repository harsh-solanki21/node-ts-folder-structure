import { app } from "./app";
import connectDB from "./configs/db";

const port = process.env.PORT || 5001;

connectDB()
	.then(() => {
		app.listen(port, () => {
			console.log(`Server is running on port ${port}`);
		});
	})
	.catch((err: Error) => {
		console.log("MongoDB Connection error ", err);
	});
