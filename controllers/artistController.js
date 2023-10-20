//const Art = require('../models/Art');
const Artist = require('../models/Artist');
const asyncHandler = require('express-async-Handler'); // this is a wrapper for async functions that catch errors
const bcrypt = require('bcryptjs'); // to encrypt passwords

// @desc    Get all artists
// @route   GET /artists
// @access  Public
const getAll = asyncHandler(async (req, res) => {
    const artists = await Artist.find().select('-password').lean();
    if(!artists) {
        res.status(404).json({ message: 'No art found' });
    }
    res.json(artists);
});


// @desc    Get artists by username
// @route   GET /artists:username
// @access  Private
const index = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const artists = await Artist.find({ username }).select('-password').lean();
    if(!artists) {
        res.status(404).json({ message: 'No art found' });
    }
    res.json(artists);
});


// @desc    Create artists
// @route   POST /artists
// @access  Private
const create = asyncHandler(async (req, res) => {

    const { username, name, password, country,bio, photo } = req.body;

    if (!username || !name || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const duplicate = await Artist.findOne({ username }).exec();

    if (duplicate) {
        return res.status(400).json({ message: 'Artist already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const artist = await Artist.create({
        username,
        name,
        "password": hashedPassword,
        country,
        bio,
        photo
    });

    if(!artist) {
        res.status(404).json({ message: 'Not Created' });
    } else {
        res.status(201).json(`Artist ${artist.username} created`);
    }
})

module.exports = { getAll, index, create };
