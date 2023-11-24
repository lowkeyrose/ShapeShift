const express = require('express')
const {
  getAllExercises,
  getExercise,
  createExercise,
  deleteExercise,
  updateExercise
} = require('../controllers/exerciseController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// GET all exercises
router.get('/', getAllExercises)

// GET a single exercise
router.get('/:id', requireAuth, getExercise)

// POST a new exercise
router.post('/new', requireAuth, createExercise)

// DELETE an exercise
router.delete('/:id', requireAuth, deleteExercise)

// UPDATE an exercise
router.put('/:id', requireAuth, updateExercise)

module.exports = router