import express from 'express';
import cookieParser from 'cookie-parser';
import connectDb from './config/db.js';
import authRouter from './routes/authRoutes.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import protect from './middleware/authMiddleware.js';
import { dashboard } from './controller/authController.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

connectDb();

app.use('/api/auth', authRouter);
app.get('/dashboard', protect, dashboard);

app.get('/', (req, res) => {
	res.status(200).json({ message: 'Auth API is running' });
});

app.use(errorMiddleware);

export default app;