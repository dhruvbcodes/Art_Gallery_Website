const mongoose = require('mongoose');

const ArtistSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: false
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    photo: {
        type: Buffer,
        required: false
    }
})

module.exports = mongoose.model('Artist', ArtistSchema);