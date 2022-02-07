const express = require('express');
const { body } = require('express-validator');

const { registerUser, login } = require('../controllers/auth');
const { isUserExistCheckByEmail } = require('../controllers/user');

const router = express.Router();

// POST /auth/register
router.post("/register",
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
                return isUserExistCheckByEmail(value)
                .then(status => {
                    if (status) {
                        return Promise.reject('E-Mail address already exists!');
                    }
                })
                .catch(err=>{
                    return Promise.reject(err);
                });
            })
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({ min: 6 })
            .withMessage('Password should be more than 6 character long.')
            ,
        body('name')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Enter a valid name')
    ],
    registerUser);

// POST /auth/login
router.post('/login', login);

module.exports = router;