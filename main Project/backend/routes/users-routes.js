import express from "express";
import { check } from 'express-validator';

import { getAllUsers, loginUser, createUser } from "../controllers/users-controllers.js";

const router = express.Router();

//get all users as a list
router.get('/', getAllUsers);

//create a new user and signin
//use check to validate input for name email and password
router.post(
    '/signup',
    [
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),//normalize email to lowercase and make sure its valid
        check('password').isLength({ min: 4 })
    ],
    createUser
);

//login a user
//use check to validate that email exists, 
// password is manualy checked so no need to validate here
router.post(
    '/login',
    [
        check('email').normalizeEmail().isEmail(),//normalize email to lowercase and make sure its valid
    ],
    loginUser
);

export default router;