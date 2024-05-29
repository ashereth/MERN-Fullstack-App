import { v4 as uuidv4 } from 'uuid';
import { validationResult } from 'express-validator'

import HttpError from "../models/http-error.js";
let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'house',
        description: 'my house',
        location: {
            lat: 45.35424919832371,
            lng: -122.86317397425815
        },
        address: '22955 sw hosler way, sherwood, OR',
        creator: 'u1'
    }
]

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(place => {
        return place.id === placeId
    });

    if (place) {
        res.json({ place });
    } else {
        //use next to throw error objects
        next(new HttpError('Could not find a place for that id.', 404));
    }
}

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const usersPlaces = DUMMY_PLACES.filter((place) => {
        return place.creator === userId;
    });

    if (usersPlaces.length > 0) {
        res.json({ usersPlaces });
    } else {
        //use next to throw error objects
        next(new HttpError("no places found for user", 404));
    }
}

const createPlace = (req, res, next) => {
    //check all the validators for errors
    const errors = validationResult(req);
    //if errors occured throw an error
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid input', 422);
    }

    //get the data from the body
    const { title, description, location, address, creator } = req.body;
    //make the new place using the data
    const newPlace = {
        id: uuidv4(),
        title,
        description,
        location,
        address,
        creator
    };
    //add new place to database
    DUMMY_PLACES.push(newPlace);
    //respond with status 201
    res.status(201).json({ place: newPlace });
}

const updatePlace = (req, res, next) => {
    //check all the validators for errors
    const errors = validationResult(req);
    //if errors occured throw an error
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid input', 422);
    }

    const placeId = req.params.pid;
    const { title, description } = req.body;
    const placeCopy = {
        ...DUMMY_PLACES.find(place => {
            return place.id = placeId;
        })
    };
    const placeIndex = DUMMY_PLACES.findIndex(place => place.id === placeId);

    if (placeIndex >= 0) {
        placeCopy.title = title;
        placeCopy.description = description;
        DUMMY_PLACES[placeIndex] = placeCopy;
        res.status(200).json(DUMMY_PLACES[placeIndex]);
    } else {
        next(new HttpError("Could not find place to be updated", 404));
    }
}

const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;
    if (!DUMMY_PLACES.find(place => { return place.id === placeId })) {
        throw new HttpError("Could not find place to be deleted", 404)
    };
    DUMMY_PLACES = DUMMY_PLACES.filter(place => {
        return place.id !== placeId;
    });

    res.status(200).json({ message: 'Place deleted.' });
}

export { getPlaceById, getPlacesByUserId, createPlace, updatePlace, deletePlace };