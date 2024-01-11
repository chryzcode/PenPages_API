const express = require('express')
const router = express.Router()

const { createTag, } = require('../controllers/tag')


router.route('/').post(createTag)

module.exports = router