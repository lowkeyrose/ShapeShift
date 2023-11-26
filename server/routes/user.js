const express = require('express')

// controller functions
const { loginUser, signupUser } = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// login status
router.post('/loginstatus', requireAuth)

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

module.exports = router