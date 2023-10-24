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
    const artist = await Artist.findOne({ username }).lean().exec();
    if(!artist) {
        res.status(404).json({ message: 'Artist not found' });
    }
    const art = await Art.find({ artist: artist._id }).lean();
    if(!art) {
        res.status(404).json({ message: 'No art found' });
    }
    res.json(art);
});



// @desc    Create art
// @route   POST /arts
// @access  Private
const create = asyncHandler(async (req, res) => {

    upload.single('photo')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Error uploading image' });
        }

        const { title, username } = req.body;

        const photo = req.file.buffer;

        if (!title || !username || !photo) {
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


// @desc    Update art
// @route   PATCH /arts/:username
// @access  Private
const update = asyncHandler(async (req, res) => {

    upload.single('photo')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Error uploading image' });
        }

        const { title, username } = req.body;

        const photo = req.file.buffer;

        if (!title || !username || !photo) {
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


//@desc   Delete art
//@route  DELETE /arts/:username
//@access Private
const deleteart = asyncHandler(async (req, res) => {
    
    const { username } = req.params;
    if (!username) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const artist = await Artist.findOne({ username }).lean().exec();

    if (!artist) {
        return res.status(404).json({ message: 'Artist not found' });
    }

    const art = await Art.findAll({ artist: artist._id }).lean();

    if (!art) {
        return res.status(404).json({ message: 'Art not found' });
    }

    const deletedart = await Art.deleteMany({ artist: artist._id }).exec();

    if (!deletedart) {
        return res.status(404).json({ message: 'Not deleted' });
    }

    return res.status(201).json(`Art ${art.title} deleted`);

});


module.exports = { getAll, index, create, update, deleteart}



