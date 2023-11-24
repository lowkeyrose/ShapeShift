const Exercise = require('../models/exerciseModel')
const mongoose = require('mongoose')

// Get all exercises
const getAllExercises = async (req, res) => {

  const exercises = await Exercise.find({}).sort({ createdAt: -1 })

  res.status(200).json(exercises)
}

// Get a single exercise
const getExercise = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Exercise not found' })
  }

  const exercise = await Exercise.findById(id)

  if (!exercise) {
    return res.status(404).json({ error: 'Exercise not found' })
  }

  res.status(200).json(exercise)
}

// Create new exercise
const createExercise = async (req, res) => {
  const { title, imgUrl, videoUrl, sets, weight, reps } = req.body

  let emptyFields = []

  if (!title) {
    emptyFields.push('title')
  }
  if (!sets) {
    emptyFields.push('sets')
  }
  if (!weight) {
    emptyFields.push('weight')
  }
  if (!reps) {
    emptyFields.push('reps')
  }
  if (emptyFields.length) {
    return res.status(400).json({ error: 'Please fill in all fields', emptyFields })
  }

  // add doc to db
  try {
    // const workout_id = req.parent._id
    const user_id = req.user._id
    const exercise = await Exercise.create({ title, imgUrl, videoUrl, sets, weight, reps, user_id })
    res.status(200).json(exercise)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Delete exercise
const deleteExercise = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Exercise not found' })
  }

  const exercise = await Exercise.findOneAndDelete({ _id: id })

  if (!exercise) {
    return res.status(404).json({ error: 'Exercise not found' })
  }

  res.status(200).json(workout)
}

// Update a workout
const updateExercise = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Exercise not found' })
  }

  const exercise = await Exercise.findOneAndUpdate({ _id: id }, {
    ...req.body
  })

  if (!exercise) {
    return res.status(404).json({ error: 'Exercise not found' })
  }

  res.status(200).json(exercise)
}


module.exports = {
  getAllExercises,
  getExercise,
  createExercise,
  deleteExercise,
  updateExercise
}