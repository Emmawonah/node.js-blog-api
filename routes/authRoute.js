const express = require('express');
const passport = require('passport');
const { Login, SignUp } = require('../controller/authController');
require('dotenv').config();

const authRoute = express.Router();

authRoute.post(
    '/signup',
    passport.authenticate('signup', { session: false }),
    SignUp
);

authRoute.post(
    '/login',
    Login
);

module.exports = authRoute;