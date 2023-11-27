const Workout = require('../models/workoutModel')
const mongoose = require('mongoose')

// Get all workouts
const getAllWorkouts = async (req, res) => {

  const workouts = await Workout.find({}).sort({ createdAt: -1 })

  res.status(200).json(workouts)
}

// Get my workouts
const getMyWorkouts = async (req, res) => {
  const user_id = req.user._id
  const workouts = await Workout.find({ user_id }).sort({ createdAt: -1 })

  res.status(200).json(workouts)
}

// Get a single workout
const getWorkout = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Workout not found' })
  }

  const workout = await Workout.findById(id)

  if (!workout) {
    return res.status(404).json({ error: 'Workout not found' })
  }

  res.status(200).json(workout)
}

// Create new workout
const createWorkout = async (req, res) => {
  const { title, imgUrl, exercises, Private } = req.body

  let emptyFields = []

  if (!title) {
    emptyFields.push('title')
  }
  if (!imgUrl) {
    emptyFields.push('imgUrl')
  }
  if (!exercises || exercises.length === 0) {
    emptyFields.push('exercises')
  }

  if (emptyFields.length) {
    return res.status(400).json({ error: 'Please fill in all fields', emptyFields })
  }

  // add doc to db
  try {
    const user_id = req.user._id
    
    const workout = await Workout.create({ title, imgUrl, exercises, Private, user_id })
    res.status(200).json(workout)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Delete a workout
const deleteWorkout = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Workout not found' })
  }

  const workout = await Workout.findOneAndDelete({ _id: id })

  if (!workout) {
    return res.status(404).json({ error: 'Workout not found' })
  }

  res.status(200).json(workout)
}

// Update a workout
const updateWorkout = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Workout not found' })
  }

  const workout = await Workout.findOneAndUpdate({ _id: id }, {
    ...req.body
  })

  if (!workout) {
    return res.status(404).json({ error: 'Workout not found' })
  }

  res.status(200).json(workout)
}


module.exports = {
  getAllWorkouts,
  getMyWorkouts,
  getWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout
}