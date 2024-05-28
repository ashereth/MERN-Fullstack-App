import express from "express";
import bodyParser from "body-parser";

import placesRoutes from "./routes/places-routes.js";

const app = express();

//make use of all the routes imported from places-routes
app.use(placesRoutes);


app.listen(5000);
console.log("app starting at http://localhost:5000/")