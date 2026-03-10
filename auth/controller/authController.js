import User from '../model/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET || 'dev_secret',
        { expiresIn: '1h' }
    );
};

export const register = async (req, res, next) => {
    try{
        const {full_name, email, password} = req.body;
        if(!full_name || !email || !password){
            const error = new Error('full_name, email and password are required');
            error.statusCode =  400;
            throw error;
        }

        const emailExist = await User.findOne({email});
        if(emailExist){
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }
        if(password.length < 8){
            const error = new Error('Not strong password');
            error.statusCode = 409;
            throw error;
        }

        const newUser = await User.create({
            full_name, 
            email, 
            password,
        });

        const userResponse = {
            _id: newUser._id,
            full_name: newUser.full_name,
            email: newUser.email,
        };

        res.status(201).json({
            success: true,
            data: userResponse,
        })
    }catch(err){
        next(err);
    }
}

export const login = async(req, res, next) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            const error = new Error('Please enter your email and password');
            error.statusCode = 400;
            throw error;
        }

        const user = await User.findOne({email});
        if(!user){
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            const error = new Error('Invalid credential');
            error.statusCode = 401;
            throw error;
        }

        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                full_name: user.full_name,
                email: user.email,
            },
        });
    }catch(err){
        next(err);
    }
}

export const logout = async (req, res, next) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (err) {
        next(err);
    }
};

export const dashboard = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: `Welcome ${req.user.full_name}`,
            data: {
                _id: req.user._id,
                full_name: req.user.full_name,
                email: req.user.email,
            },
        });
    } catch (err) {
        next(err);
    }
};