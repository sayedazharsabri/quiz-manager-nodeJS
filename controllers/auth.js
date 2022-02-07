const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.registerUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed.');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const email = req.body.email;
        const name = req.body.name;
        const password = req.body.password;

        const hashPassword = await bcrypt.hash(password, 12);
        const user = new User({ email, name, password: hashPassword });
        const result = await user.save();
        res.status(201).send({ status: "success", message: "Registration successful", data: { userId: result._id } });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({ email })
        if (!user) {
            const error = new Error('Check your email and try again.');
            error.statusCode = 401;
            throw error;
        }

        let isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            const error = new Error('Invalid credentials!');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            {
                email: user.email,
                userId: user._id.toString()
            },
            'somesupersecretsecret',//??? Enter secret key or from file
            { expiresIn: '1h' }
        );
        res.status(200).json({ token: token });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};


exports.isUserExistCheckByEmail = async (email) => {
    const user = await User.findOne({ email });
    if (user) {
        return true;
    }
    return false;
}

