const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');


const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    console.log('Registration attempt:', { name, email, passwordLength: password?.length });

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }


    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }


    try {
        const user = await User.create({
            name,
            email,
            password,
        });

        console.log('User created successfully:', user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            currency: user.currency,
            theme: user.theme,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(400);
        throw error;
    }
});


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;


    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            currency: user.currency,
            theme: user.theme,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
});


const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});


const updateProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;


        if (req.body.email && req.body.email !== user.email) {
            const emailExists = await User.findOne({ email: req.body.email });
            if (emailExists) {
                res.status(400);
                throw new Error('Email already in use');
            }
            user.email = req.body.email;
        }


        if (req.body.avatar === 'letter' || req.body.avatar === '') {
            user.avatar = '';
        } else {
            user.avatar = req.body.avatar;
        }

        user.currency = req.body.currency || user.currency;
        user.theme = req.body.theme || user.theme;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();


        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
            currency: updatedUser.currency,
            theme: updatedUser.theme,
            token: req.headers.authorization.split(' ')[1], 
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateProfile,
};
