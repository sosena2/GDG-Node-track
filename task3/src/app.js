import express from "express";
import morgan from "morgan";
import bookRoutes from "./routes/bookRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// Global middleware
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/books", bookRoutes);

// Error handling middleware 
app.use(errorHandler);

export default app;
