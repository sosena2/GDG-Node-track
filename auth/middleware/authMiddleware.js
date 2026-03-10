import jwt from 'jsonwebtoken';
import User from '../model/User.js';

const protect = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            const error = new Error('Unauthorized: token missing');
            error.statusCode = 401;
            throw error;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            const error = new Error('Unauthorized: invalid token');
            error.statusCode = 401;
            throw error;
        }

        req.user = user;
        next();
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 401;
            err.message = 'Unauthorized: invalid or expired token';
        }
        next(err);
    }
};

export default protect;
