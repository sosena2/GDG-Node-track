import express from 'express';
import { register, login, logout, dashboard } from '../controller/authController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', register);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/dashboard', protect, dashboard);

export default router;