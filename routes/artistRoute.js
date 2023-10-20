const express = require('express')
const router = express.Router();
const artistController = require('../controllers/artistController')

router.route('/')
    .get(artistController.getAll)
    .post(artistController.create)

router.route('/:username')
    .get(artistController.index)
    //.post(artistController.create)
    //.patch(artistController.update)
    //.delete(artistController.delete)

module.exports = router