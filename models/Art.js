const mongoose = require('mongoose');
const Artist = require('./Artist');

const ArtSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Artist'
    },
    photo: {
        type: Buffer,
        required: false
    }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Art', ArtSchema);