const express = require('express')
const router = express.Router()
const {register, login, getAllUsers} = require('../controllers/user')


router.route("/auth/register").post(register);
router.route("/auth/login").post(login);
router.route('/all-users').get(getAllUsers)

module.exports = router