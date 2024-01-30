const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const validation = require('../middleware/Validation')
const router = express.Router()

// Controller functions
const {
  getAllWorkouts,
  getMyWorkouts,
  getWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout,
  getFavoriteWorkouts,
  favorite,
  unFavorite
} = require('../controllers/workoutController')

// GET all workouts
router.get('/', getAllWorkouts)

// GET my workouts
router.get('/myworkouts', requireAuth, getMyWorkouts)

// GET my favorite workouts
router.get('/favoriteworkouts', requireAuth, getFavoriteWorkouts)

// GET a single workouts
router.get('/workout/:id', getWorkout)

// POST a new workout
router.post('/myworkouts/create/new', requireAuth, validation, createWorkout)

// DELETE a workout
router.delete('/myworkouts/:id', requireAuth, deleteWorkout)

// UPDATE a workout
router.put('/myworkouts/edit/:id', requireAuth, validation, updateWorkout)

// Add to favorites
router.put('/favorite/:id', requireAuth, favorite)

// Remove from favorites
router.put('/unfavorite/:id', requireAuth, unFavorite)

module.exports = router