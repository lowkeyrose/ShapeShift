const express = require('express')

// controller functions
const { loginUser, signupUser, authenticate, updateUser, getUsers, deleteUser, getUser } = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// authenticate
router.post('/authenticate', requireAuth, authenticate)

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

// update user
router.put('/update/:id', requireAuth, updateUser)

// Admin routes 

// get all users
router.get('/users', requireAuth, getUsers)

// get single user
router.get('/:id', requireAuth, getUser)

// delete user
router.delete('/:id', requireAuth, deleteUser)


module.exports = router