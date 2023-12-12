const Workout = require('../models/workoutModel')
const mongoose = require('mongoose')
const Exercise = require('../models/exerciseModel');

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
  try {
    // Extract workout and exercises data from the request body
    const workoutData = req.body
    let exercisesData = req.body.exercises
    workoutData.user_id = req.user._id
    exercisesData = exercisesData.map(exercises => ({ ...exercises, user_id: workoutData.user_id }))

    // Create a new workout
    const newWorkout = await Workout.create(workoutData)

    // Update the workout's exercises field with the created exercise
    const createdExercises = await Exercise.create(exercisesData.map(exercises => ({ ...exercises, workout_id: newWorkout._id })))

    // Update the workout document with the IDs of the created exercises
    newWorkout.exercises = createdExercises.map(exercise => exercise._id)
    await newWorkout.save()

    res.status(201).json({ success: true, workout: newWorkout })

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}
//   const { title, imgUrl, exercises, Private } = req.body

//   console.log('recieved data: ', req.body);

//   let emptyFields = []

//   if (!title) {
//     emptyFields.push('title')
//   }
//   if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
//     return res.status(400).json({ error: 'Please provide at least one exercise' })
//   }

//   if (emptyFields.length) {
//     return res.status(400).json({ error: 'Please fill in all fields', emptyFields })
//   }

//   // add doc to db
//   try {
//     const user_id = req.user._id

//     const workout = await Workout.create({ title, imgUrl, exercises, Private, user_id })

//     res.status(200).json(workout)
//   } catch (error) {
//     res.status(400).json({ error: error.message })
//   }
// }

// Delete a workout
const deleteWorkout = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Workout not found' })
  }

  try {
    // Find the workout and store its ID
    const workout = await Workout.findOneAndDelete({ _id: id })

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' })
    }

    // Delete all exercises with the corresponding workout_id
    await Exercise.deleteMany({ workout_id: workout._id })

    res.status(200).json(workout)
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
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