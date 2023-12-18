const express = require('express')

// controller functions
const { loginUser, signupUser, authenticate } = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// authenticate
router.post('/authenticate', requireAuth, authenticate)

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

module.exports = router