
const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');

const authControllers = require('../controllers/auth');
const userUtils = require('../database/user');

const router = express.Router();

router.post('/signup', [
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, {req}) => {
            return userUtils.findUserWithEmail(value).then(user => {
                if(user){
                    return Promise.reject('Email address already registered!');
                }
            })
        }),
    
    check('name')
        .trim()
        .isLength({min: 3})
        .withMessage('Name should atleast be 3 characters long.')
        .isLength({max: 30})
        .withMessage('Name can atmost be 30 characters long'),

    check('password')
        .trim()
        .isLength({min: 6})
        .withMessage('Password should atleat be 6 characters long.')
        
], authControllers.postSignup);


router.post('/login', [
    check('email')
        .custom((value, {req}) => {
            return userUtils.findUserWithEmail(value).then(user => {
                if(!user){
                    return Promise.reject('This E-mail is not registered.');
                }
            })
        }),

    check('password')
        .custom((value, {req}) => {
            return userUtils.findUserWithEmail(req.body.email).then(user => {
                if(user){
                    return bcrypt
                            .compare(value, user.password)
                            .then(isEqual => {
                                if(!isEqual){
                                    return Promise.reject('Please enter the correct password.');
                                }
                            })
                }
            })
        })
], authControllers.postLogin);

module.exports = router;