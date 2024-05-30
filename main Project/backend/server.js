import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from 'dotenv';

import placesRoutes from "./routes/places-routes.js";
import usersRoutes from './routes/users-routes.js';
import HttpError from "./models/http-error.js";

dotenv.config();
const app = express();

//middleware to parse body and extract json data
app.use(bodyParser.json());

//make use of all the routes imported from places-routes
//route must start with /api/places...
app.use("/api/places", placesRoutes);

app.use("/api/users", usersRoutes);

//middleware for unsupported routes
app.use((req, res, next) => {
    const error = new HttpError('Could not find route.', 404);
    throw error;
});

//error handling middleware
app.use((error, req, res, next) => {
    //if response already sent forward error
    if (res.headerSent) {
        return next(error);
    }
    //set status or set status to 500
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
});


//connect to database using mongoose
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {//if connection successful start server
        console.log('connected to database!');
        app.listen(5000);
        console.log('server started!');
    })
    .catch(err => {//if connection unsuccessful log error
        console.log(err)
    })


console.log("app starting at http://localhost:5000/")