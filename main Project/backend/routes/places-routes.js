import express from "express";
import { check } from 'express-validator';

import { getPlaceById, getPlacesByUserId, createPlace, updatePlace, deletePlace } from "../controllers/places-controllers.js";

const router = express.Router();



//gets a single place with matching id
router.get('/:pid', getPlaceById);

//gets an array of places associated with a user id
router.get('/user/:uid', getPlacesByUserId);

//add a new place
// use check middleware to make sure title isnt empty and description is at least 5 chars
router.post(
    "/",
    [
        check('title').not().isEmpty(),
        check('description').isLength({ min: 5 }),
        check('address').not().isEmpty(),
    ],
    createPlace
);

//update a place
router.patch(
    '/:pid',
    [
        check('title').not().isEmpty(),
        check('description').isLength({ min: 5 }),
    ],
    updatePlace
);

//delete a place
router.delete('/:pid', deletePlace)

export default router;