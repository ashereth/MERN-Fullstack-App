import express from "express";

const router = express.Router();

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

//gets a single place with matching id
router.get('/:pid', (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(place => {
        return place.id === placeId
    });
    if (place) {
        res.json({place});
    } else{
        return res.json({message: "no place found"})
    }
});

//gets an array of places associated with a user id
router.get('/user/:uid', (req, res, next) => {
    const userId = req.params.uid;
    const usersPlaces = DUMMY_PLACES.filter((place) => {
        return place.creator === userId;
    });

    if (usersPlaces) {
        res.json({usersPlaces});
    } else{
        return res.json({message: "no places found for user"})
    }
});

export default router;