const express = require('express')

// controller functions
const { loginUser, signupUser, loginStatus } = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// login status
router.get('/loginstatus', requireAuth, loginStatus)

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

module.exports = router