import express from "express";

import HttpError from "../models/http-error.js";

const router = express.Router();

router.get('/', (req, res, next) => {
    console.log('Get Users');
    res.json({ message: 'it works' });
})

export default router;