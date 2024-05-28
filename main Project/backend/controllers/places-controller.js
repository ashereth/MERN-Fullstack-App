import HttpError from "../models/http-error.js";

const DUMMY_PLACES = [
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
    },
    {
        id: 'p2',
        title: 'house 2',
        description: 'my house 2',
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
    //get the data from the body
    const { title, description, location, address, creator } = req.body;
    //make the new place using the data
    const newPlace = {
        title,
        description,
        location,
        address,
        creator
    };
    //add new place to database
    DUMMY_PLACES.push(newPlace);
    //respond with status 201
    res.status(201).json({place: newPlace});
    console.log('here')
}

export { getPlaceById, getPlacesByUserId, createPlace };