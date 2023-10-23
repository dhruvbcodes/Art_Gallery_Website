const Art = require('../models/Art')
const Artist = require('../models/Artist')
const asyncHandler = require('express-async-Handler');
const multer = require('multer');

const storage = multer.memoryStorage(); // Store the image in memory as a buffer
const upload = multer({ storage });


// @desc    Get all art
// @route   GET /arts
// @access  Public
const getAll = asyncHandler(async (req, res) => {
    const art = await Art.find().lean();
    if(!art) {
        res.status(404).json({ message: 'No art found' });
    }
    
    const artwithusername = await Promise.all(art.map(async (art) => {
        const artist = await Artist.findOne({ username: art.username }).lean().exec();
        return { ...art, artist };
    }))

    res.json(artwithusername);
});


// @desc    Get art by username
// @route   GET /arts:username
// @access  Public
const index = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const art = await Art.find({ username }).lean();
    if(!art) {
        res.status(404).json({ message: 'No art found' });
    }
    res.json(art);
});



// @desc    Create art
// @route   POST /arts
// @access  Private
const create = asyncHandler(async (req, res) => {

    const { title, username } = req.body;

    upload.single('photo')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Error uploading image' });
        }

        const photo = req.buffer;

        if (!title || !username) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        const artist = await Artist.findOne({ username }).lean().exec();

        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' });
        }
    
        const duplicate = await Art.findOne({ title}).exec();

        if (duplicate) {
            return res.status(400).json({ message: 'Art already exists' });
        }

        const art = await Art.create({
            title,
            photo,
            artist: artist._id,
        });

        if (!art) {
            return res.status(404).json({ message: 'Not Created' });
        } else {
            return res.status(201).json(`Art ${art.title} created`);
        }
    });
});



module.exports = { getAll, index, create }



