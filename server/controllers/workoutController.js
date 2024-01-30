const mongoose = require('mongoose')
const Workout = require('../models/workoutModel')
const Exercise = require('../models/exerciseModel')
const { User } = require('../models/userModel')

// Get all workouts
const getAllWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({}).sort({ createdAt: -1 })
    res.status(200).json(workouts)
  } catch (error) {
    console.error('Error fetching all workouts:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

// Get my workouts
const getMyWorkouts = async (req, res) => {
  const user_id = req.user._id
  try {
    const workouts = await Workout.find({ user_id }).sort({ createdAt: -1 })
    res.status(200).json(workouts)
  } catch (error) {
    console.error('Error fetching my workouts:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

// Get all favorite workouts
const getFavoriteWorkouts = async (req, res) => {
  const user = req.user
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  try {
    // Extract the favorites array from the user
    const favoriteWorkoutIds = user.favorites || []

    // Find the workouts with the Ids from the favorites array
    const favoriteWorkouts = await Workout.find({ _id: { $in: favoriteWorkoutIds } })

    // Sort to display the last added first
    favoriteWorkouts.sort((b, a) => {
      return favoriteWorkoutIds.indexOf(a._id.toString()) - favoriteWorkoutIds.indexOf(b._id.toString())
    })

    res.status(200).json(favoriteWorkouts)
  } catch (error) {
    console.error('Error fetching favorite workouts:', error)
    res.status(500).json({ message: 'Internal server error.' })
  }
}

// Get a single workout
const getWorkout = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Workout not found' })
  }

  try {
    const workout = await Workout.findById(id)
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' })
    }

    const exercises = await Exercise.find({ _id: { $in: workout.exercises } })
    workout.exercises = exercises
    res.status(200).json(workout)
  } catch (error) {
    console.error('Error in getWorkout:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Create new workout
const createWorkout = async (req, res) => {
  const workoutData = {
    ...req.body,
    user_id: req.user._id,
    userProfilePic: req.user.profilePic,
    username: req.user.username
  }
  let exercisesData = workoutData.exercises.map(exercises => ({ ...exercises, user_id: workoutData.user_id }))

  try {
    // Check if a workout with the same title already exists for the current user
    const existingWorkout = await Workout.findOne({ title: workoutData.title, user_id: workoutData.user_id })

    // Send custom status to handle front-end error visually
    if (existingWorkout) {
      return res.status(420).json({ success: false, error: 'Title already in use for this user' })
    }

    const newWorkout = await Workout.create(workoutData)

    // Create the exercises with the workout id
    const createdExercises = await Exercise.create(exercisesData.map(exercises => ({ ...exercises, workout_id: newWorkout._id })))

    // Keep just the ids of the exercises
    newWorkout.exercises = createdExercises.map(exercise => exercise._id)

    await newWorkout.save()
    res.status(201).json({ success: true, workout: newWorkout })
  } catch (error) {
    console.error('Error in creating workout:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

// Delete a workout
const deleteWorkout = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Workout not found' })
  }

  try {
    const workout = await Workout.findOne({ _id: id })
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' })
    }
    // Check if the workout belongs to the requesting user or if its an admin request
    if (!req.user._id.equals(workout.user_id) && req.user.roleType !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    // Find users who favorited this workout
    const usersToUpdate = await User.find({ favorites: id })

    // Remove workout id from users' favorites
    await Promise.all(usersToUpdate.map(async (user) => {
      if (user && user.favorites) {
        user.favorites = user.favorites.filter((favorite) => favorite && favorite.toString() !== id)
        await user.save()
      }
    }))

    // Delete workout all exercises with the corresponding workout_id
    const deletedWorkout = await Workout.findByIdAndDelete(id)
    await Exercise.deleteMany({ workout_id: deletedWorkout._id })

    res.status(200).json(deletedWorkout)
  } catch (error) {
    console.error('Error in deleting workout:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

// Update a workout
const updateWorkout = async (req, res) => {
  const workoutData = req.body
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Workout not found' })
  }

  try {
    const workout = await Workout.findOne({ _id: id })
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' })
    }
    // Check if the workout belongs to the requesting user
    if (!req.user._id.equals(workout.user_id) && req.user.roleType !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized user' })
    }

    // Update or create exercises
    const updatedExercisesIds = await Promise.all(workoutData.exercises.map(async (exercise) => {
      if (exercise._id) {
        // Exercise already has an _id, update it
        const existingExercise = await Exercise.findOne({ _id: exercise._id })
        if (existingExercise) {
          const hasChanges = JSON.stringify(exercise) !== JSON.stringify(existingExercise)

          if (hasChanges) {
            Object.assign(existingExercise, exercise)
            await existingExercise.save()
            return existingExercise._id
          } else {
            return existingExercise._id
          }
        }
      } else {
        // Exercise doesn't have an _id, create it
        const newExercise = await Exercise.create({
          ...exercise,
          user_id: workoutData.user_id,
          workout_id: workoutData._id
        })
        return newExercise._id
      }
    }))

    // Identify exercises to be deleted
    const exercisesToDelete = workout.exercises
      .map((exerciseId) => exerciseId.toString())
      .filter((exerciseId) => !updatedExercisesIds.toString().includes(exerciseId))

    // Delete exercises that are no longer present in the updated workout
    await Exercise.deleteMany({ _id: { $in: exercisesToDelete } })

    // Check if the fields have changed before updating
    if (workout.title !== workoutData.title) {
      workout.title = workoutData.title
    }

    if (workout.imgUrl !== workoutData.imgUrl) {
      workout.imgUrl = workoutData.imgUrl
    }

    if (workout.Private !== workoutData.Private) {
      workout.Private = workoutData.Private
    }
    // Update the workout's exercises array with the new/existing exercises ids
    workout.exercises = updatedExercisesIds

    await workout.save()
    res.status(200).json(workout)
  } catch (error) {
    console.error('Error updating workout:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

// Add workout to favorites
const favorite = async (req, res) => {
  const user = req.user
  const workout_id = req.params.id
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  if (user.favorites.includes(workout_id)) {
    return res.status(400).json({ message: 'Workout already in favorites.' })
  }

  try {
    const workout = await Workout.findById(workout_id)
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    user.favorites.push(workout_id)
    workout.likes = (workout.likes || 0) + 1;
    await Promise.all([user.save(), workout.save()])
    res.status(200).json({ workout, message: 'Workout added to favorites successfully.' })
  } catch (error) {
    console.error('Error adding workout to favorites:', error)
    res.status(500).json({ message: 'Internal server error.' })
  }
}

// Remove workout from favorites
const unFavorite = async (req, res) => {
  const user = req.user
  const workout_id = req.params.id
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  if (!user.favorites.includes(workout_id)) {
    return res.status(400).json({ message: 'Workout is not in favorites.' })
  }

  try {
    const workout = await Workout.findById(workout_id)
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' })
    }

    workout.likes = Math.max((workout.likes || 0) - 1, 0)
    user.favorites = user.favorites.filter((favorite) => favorite.toString() !== workout_id)
    await Promise.all([user.save(), workout.save()])
    res.status(200).json({ workout, message: 'Workout removed from favorites successfully.' })
  } catch (error) {
    console.error('Error removing workout from favorites:', error)
    res.status(500).json({ message: 'Internal server error.' })
  }
}

module.exports = {
  getAllWorkouts,
  getMyWorkouts,
  getWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout,
  getFavoriteWorkouts,
  favorite,
  unFavorite
}