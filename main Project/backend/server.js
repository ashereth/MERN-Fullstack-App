import express from "express";
import bodyParser from "body-parser";

import placesRoutes from "./routes/places-routes.js";
import usersRoutes from './routes/users-routes.js';

const app = express();

//middleware to parse body and extract json data
app.use(bodyParser.json());

//make use of all the routes imported from places-routes
//route must start with /api/places...
app.use("/api/places", placesRoutes);

app.use("/api/users", usersRoutes);

//error handling middleware
app.use((error, req, res, next) => {
    //if response already sent forward error
    if(res.headerSent){
        return next(error);
    }
    //set status or set status to 500
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred!'});
});

app.listen(5000);
console.log("app starting at http://localhost:5000/")