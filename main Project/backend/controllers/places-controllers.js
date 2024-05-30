import { v4 as uuidv4 } from 'uuid';
import { validationResult } from 'express-validator'
import mongoose from 'mongoose';

import getCoordinatesForAddress from '../util/location.js';
import HttpError from "../models/http-error.js";
import Place from '../models/place.js';
import User from '../models/user.js';


const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;


    //try to get the place and throw an error if it fails
    let place
    try {
        place = await Place.findById(placeId).exec();
    } catch (error) {
        return next(new HttpError('Something went wrong, could not find a place for that id.', 500));
    }

    //if database worked but no place was returned thow a different error
    if (place) {
        //return the place as an object but keep its id properties by setting getters: true
        res.json({ place: place.toObject({ getters: true }) });
    } else {
        //use next to throw error objects
        return next(new HttpError('Could not find a place for that id.', 404));
    }
}

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let usersPlaces;
    //try to get the users places from database
    try {
        //use populate to attatch all the places objects to the gotten user
        let user = await User.findById(userId).populate('places');
        usersPlaces = user.places;
    } catch (error) {
        return next(new HttpError('Something went wrong, could not find places for that user.', 500));
    }

    //if user had no places throw error otherwise return places
    if (!usersPlaces || usersPlaces.length === 0) {
        //return the users places after turing each place into an object
        res.json({ usersPlaces: usersPlaces.map(place => place.toObject({ getters: true })) });
    } else {
        //use next to throw error objects
        return next(new HttpError("no places found for user", 404));
    }
}

const createPlace = async (req, res, next) => {
    //check all the validators for errors
    const errors = validationResult(req);
    //if errors occured throw an error
    if (!errors.isEmpty()) {
        //for async functions you must use next() not throw
        return next(new HttpError('Invalid input', 422));
    }

    //get the data from the body
    const { title, description, address, creator } = req.body;
    //get the coordinates or throw error
    let coordinates;
    try {
        coordinates = await getCoordinatesForAddress(address);
    } catch (error) {
        return next(error);
    }

    //make the new place using the data
    const newPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: 'data:image/jpeg;base64,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',
        creator
    });

    //need to check if user exists already
    let user;
    try {
        user = await User.findById(creator);
    } catch (err) {
        const error = new HttpError(
            'Creating place failed could not find user.',
            500
        )
        return next(error);
    }

    if (!user) {
        const error = new HttpError(
            'Creating place failed. Could not find user for that id.',
            500
        )
        return next(error);
    }

    //add new place to database or throw error
    try {
        //use a session to ensure all things happen or none
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await newPlace.save({ session: sess });
        user.places.push(newPlace);//only adds place id
        await user.save({ session: sess })

        await sess.commitTransaction();//commit transaction

    } catch (err) {
        const error = new HttpError(
            'Creating place failed',
            500
        )
        return next(error);
    }

    //respond with status 201
    res.status(201).json({ place: newPlace });
}

const updatePlace = async (req, res, next) => {
    //check all the validators for errors
    const errors = validationResult(req);
    //if errors occured throw an error
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid input', 422));
    }

    const placeId = req.params.pid;
    const { title, description } = req.body;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        return next(new HttpError("Something went wrong could not update place", 500));
    }
    if (place) {
        place.title = title;
        place.description = description;
    } else {
        return next(new HttpError("Could not find place", 404));
    }


    try {
        await place.save();
    } catch (error) {
        return next(new HttpError("Something went wrong could not update place", 500));
    }

    res.status(200).json({ place: place.toObject({ getters: true }) })
}

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;

    //get delete place from database 
    let place;
    try {
        //use populate to get the whole place object in relation ot the user
        place = await Place.findById(placeId).populate('creator');
    } catch (error) {
        return next(new HttpError('Something went wrong could not delete place.', 500))
    }

    if (!place) {
        return next(new HttpError('Could not find place for that id.', 404))
    }

    try {
        //start session
        const sess = await mongoose.startSession();
        sess.startTransaction();
        //delete place
        await place.deleteOne({ session: sess });
        //remove place from user places array
        place.creator.places.pull(place);
        await place.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (error) {
        return next(new HttpError('Something went wrong could not delete place.', 500))
    }


    res.status(200).json({ message: 'Place deleted.' });
}

export { getPlaceById, getPlacesByUserId, createPlace, updatePlace, deletePlace };