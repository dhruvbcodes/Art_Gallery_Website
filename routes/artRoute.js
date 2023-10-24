const express = require('express')
const router = express.Router()
const artController = require('../controllers/artController')

router.route('/')
    .get(artController.getAll)
    .post(artController.create)

router.route('/:username')
    .get(artController.index)
    .patch(artController.update)
    .delete(artController.deleteart)

module.exports = router