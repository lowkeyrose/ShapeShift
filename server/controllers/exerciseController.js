const Exercise = require('../models/exerciseModel')
const Workout = require('../models/workoutModel')
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
  const { title, imgUrl, videoUrl, sets, weight, reps, workout_id } = req.body

  // const requiredFields = ['title', 'sets', 'weight', 'reps'];
  // const emptyFields = requiredFields.filter(field => !req.body[field]);

  // if (emptyFields.length > 0) {
  //   return res.status(400).json({ error: 'Please fill in all fields', emptyFields });
  // }

  // add doc to db
  try {
    if (workout_id && mongoose.Types.ObjectId.isValid(workout_id)) {
      // Check if the workout exists
      const workout = await Workout.findOne({ _id: workout_id });

      if (!workout) {
        return res.status(400).json({ error: 'Workout not found' });
      }
      console.log('workout: ', workout);

      const user_id = req.user._id
      const exercise = await Exercise.create({ title, imgUrl, videoUrl, sets, weight, reps, user_id, workout_id })

      // Add the new exercise ID to the workout's exercises array
      workout.exercises.push(exercise._id);
      
      // Save the updated workout
      await workout.save();

      res.status(200).json(exercise)
    } else {
      return res.status(400).json({ error: 'Invalid workout_id' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Delete exercise
const deleteExercise = async (req, res) => {
  const { id } = req.params;
  console.log('id: ', id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Exercise not found' });
  }

  try {
    // Find and delete the exercise
    const exercise = await Exercise.findOneAndDelete({ _id: id })

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' })
    }

    // Find and update the workout that references the deleted exercise
    const workout = await Workout.findOne({ _id: exercise.workout_id })

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' })
    }

    // Remove the exercise ID from the exercises array
    workout.exercises = workout.exercises.filter(exerciseId => exerciseId.toString() !== id)

    // Save the updated workout
    await workout.save()

    res.status(200).json(exercise)
  } catch (error) {
    console.error('Error deleting exercise:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update exercise
const updateExercise = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Exercise not found' })
  }

  const exercise = await Exercise.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true })

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