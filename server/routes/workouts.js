const express = require('express')
const {
  getAllWorkouts,
  getMyWorkouts,
  getWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout,
  getFavoriteWorkouts,
  addFavorite,
  removeFavorite
} = require('../controllers/workoutController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()
// PERSONAL INFO 
// placed here to allow anyone to see all workouts and a single workout but not other actions like create, update or delete
// require auth for all workout routes

// GET all workouts
router.get('/', getAllWorkouts)

// GET my  workouts
router.get('/myworkouts', requireAuth, getMyWorkouts)

// GET my favorite workouts
router.get('/favoriteworkouts', requireAuth, getFavoriteWorkouts)

// if you want that the :id won't interfere with the other routes
// router.get('/singleworkout/:id', getWorkout)
// GET a single workouts
router.get('/workout/:id', getWorkout)

// POST a new workout
router.post('/myworkouts/create/new', requireAuth, createWorkout)

// DELETE a workout
router.delete('/myworkouts/:id', requireAuth, deleteWorkout)

// UPDATE a workout
router.put('/myworkouts/:id', requireAuth, updateWorkout)

// Add to favorites
router.put('/favorite/:id', requireAuth, addFavorite)

// Remove from favorites
router.put('/unfavorite/:id', requireAuth, removeFavorite)

module.exports = router