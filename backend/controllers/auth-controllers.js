const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { SECRET } = require('../config');
const userUtils = require('../utils/db-utils/user-utils');

exports.postSignup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error('Sign up failed!');
      err.data = errors.array();
      err.statusCode = 422;
      throw err;
    }

    const { name, email, gender, password } = req.body;
    const phoneNo = parseInt(req.body.phoneNo);
    const isAdmin = req.body.isAdmin === 'true' ? true : false;

    const hashPassword = await bcrypt.hash(password, 12);
    const user = {
      name,
      email,
      phoneNo,
      gender,
      password: hashPassword,
      isAdmin,
    };
    const createdUser = await userUtils.createUser(user);
    res.status(201).json({
      message: 'Signed up successfully.',
      success: true,
      user: createdUser,
    });
  } catch (error) {
    error.statusCode = 500;
    error.message = error.message || 'Sign Up failed! Please try again!';
    return next(error);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error('Login failed!');
      err.statusCode = 422;
      err.data = errors.array();
      throw err;
    }

    const email = req.body.email;

    const currentUser = await userUtils.findUserWithEmail(email);
    const token = jwt.sign(
      {
        email: email,
        userId: currentUser._id,
      },
      SECRET
    );

    res.status(200).json({
      token: token,
      success: true,
      userDetails: {
        id: currentUser._id,
        name: currentUser.name,
        isAdmin: currentUser.isAdmin,
      },
    });
  } catch (err) {
    if (err.statusCode === 422) return next(err);
    const error = new Error('Cannot find user!');
    error.statusCode = 500;
    return next(error);
  }
};
