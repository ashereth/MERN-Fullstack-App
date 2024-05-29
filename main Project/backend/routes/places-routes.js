import express from "express";

import { getPlaceById, getPlacesByUserId, createPlace, updatePlace, deletePlace } from "../controllers/places-controller.js";

const router = express.Router();



//gets a single place with matching id
router.get('/:pid', getPlaceById);

//gets an array of places associated with a user id
router.get('/user/:uid', getPlacesByUserId);

//add a new place
router.post("/", createPlace);

//update a place
router.patch('/:pid', updatePlace);

//delete a place
router.delete('/:pid', deletePlace)

export default router;