const mongoose = require('mongoose');

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
    photoUrl: {
        type: String,
        required: false
    }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Art', ArtSchema);