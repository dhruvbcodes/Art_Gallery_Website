const express = require('express')
const router = express.Router()
const artController = require('../controllers/artController')

router.route('/')
    .get(artController.getAll)
    
router.route('/:id')
    .get(artController.index)
    .post(artController.create)
    .patch(artController.update)
    .delete(artController.delete)