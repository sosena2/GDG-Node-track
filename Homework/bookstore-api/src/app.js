import express from "express";
import bookRoutes from "./routes/bookRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

app.use(express.json());
app.use("/books", bookRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
