import axios from "axios";

import HttpError from "../models/http-error.js";

const API_KEY = 'AIzaSyDbW0MATDEd3lATf_Xs9DaEyuJtiXNognE';

async function getCoordinatesForAddress(address) {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`)

    const data = response.data;

    if (!data || data.status === 'ZERO_RESULTS') {
        const error = new HttpError('Could not find location of address.', 422);
        throw error;
    }

    const coordinates = data.results[0].geometry.location;

    return coordinates;
}

export default getCoordinatesForAddress;