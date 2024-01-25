const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

// Controller functions
const { loginUser,
  signupUser,
  authenticate,
  updateUser,
  getUsers,
  deleteUser,
  getUser
} = require('../controllers/userController')

// Authenticate
router.post('/authenticate', requireAuth, authenticate)

// Login route
router.post('/login', loginUser)

// Signup route
router.post('/signup', signupUser)

// Update user
router.put('/update/:id', requireAuth, updateUser)


// Admin routes 

// Get all users
router.get('/users', requireAuth, getUsers)

// Get single user
router.get('/:id', requireAuth, getUser)

// Delete user
router.delete('/:id', requireAuth, deleteUser)

module.exports = router