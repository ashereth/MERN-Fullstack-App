import express from "express";
import bodyParser from "body-parser";

import placesRoutes from "./routes/places-routes.js";
import usersRoutes from './routes/users-routes.js';

const app = express();

//make use of all the routes imported from places-routes
//route must start with /api/places...
app.use("/api/places", placesRoutes);

app.use("/api/users", usersRoutes);


app.listen(5000);
console.log("app starting at http://localhost:5000/")