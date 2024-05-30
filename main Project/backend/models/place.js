import mongoose from "mongoose";

const Schema = mongoose.Schema;

const placeSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },//files should never be stored in a database so just store the url
    address: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    //relation between places and users
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
})

export default mongoose.model('Place', placeSchema);