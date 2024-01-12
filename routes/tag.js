const express = require('express')
const router = express.Router()

const { createTag, getAllTags} = require('../controllers/tag')


router.route('/').post(createTag).get(getAllTags)

module.exports = router