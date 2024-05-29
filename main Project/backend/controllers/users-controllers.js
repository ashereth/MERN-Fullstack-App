import { v4 as uuidv4 } from 'uuid';
import { validationResult } from 'express-validator'

import HttpError from "../models/http-error.js";

let DUMMY_USERS = [
    {
        id: 'u1',
        name: 'asher',
        email: 'asherce21@gmail.com',
        password: '1234'
    }
]

let DUMMY_LOGGED_IN = false;

//get a list of all users
const getAllUsers = (req, res, next) => {
    res.json({ users: DUMMY_USERS });
}

//create a new user and log them in
const createUser = ((req, res, next) => {
    //check all the validators for errors
    const errors = validationResult(req);
    //if errors occured throw an error
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid input', 422);
    }

    const { name, email, password } = req.body;

    const existingUser = DUMMY_USERS.find(user => user.email === email)
    console.log(existingUser);
    if (existingUser) {
        throw new HttpError('Cannot create user, email already in use', 422);
    }


    const newUser = {
        id: uuidv4(),
        name,
        email,
        password
    }

    DUMMY_LOGGED_IN = true;

    DUMMY_USERS.push(newUser);
    res.status(201).json({ newUser, loggedIn: DUMMY_LOGGED_IN });
});

//login the user given email and password
const loginUser = (req, res, next) => {
    //check all the validators for errors
    const errors = validationResult(req);
    //if errors occured throw an error
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid input', 422);
    }

    const { email, password } = req.body;
    const userToLogin = DUMMY_USERS.find((user) => {
        return (user.email === email && user.password === password);
    });

    if (userToLogin) {
        DUMMY_LOGGED_IN = true;
        res.json({ user: userToLogin.name, loggedIn: DUMMY_LOGGED_IN });
    } else {
        throw new HttpError('Cannot find a user to login with those credentials', 401);
    }

}

export { getAllUsers, createUser, loginUser };