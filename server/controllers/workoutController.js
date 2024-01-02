const Workout = require('../models/workoutModel')
const mongoose = require('mongoose')
const Exercise = require('../models/exerciseModel')
const User = require('../models/userModel')

// Get all workouts
const getAllWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({}).sort({ createdAt: -1 });
    res.status(200).json(workouts);
  } catch (error) {
    console.error('Error fetching all workouts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// Get my workouts
const getMyWorkouts = async (req, res) => {
  const user_id = req.user._id
  const workouts = await Workout.find({ user_id }).sort({ createdAt: -1 })

  res.status(200).json(workouts)
}

// GET all favorite workouts
const getFavoriteWorkouts = async (req, res) => {
  const user = req.user
  try {
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract the favorites array from the user
    const favoriteWorkoutIds = user.favorites || [];

    // Find the workouts with the IDs in the favorites array
    const favoriteWorkouts = await Workout.find({ _id: { $in: favoriteWorkoutIds } });

    res.status(200).json(favoriteWorkouts)
  } catch (error) {
    console.error('Error fetching favorite workouts:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

// Get a single workout
const getWorkout = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Workout not found' })
  }

  const workout = await Workout.findById(id)
  const exercises = await Exercise.find({ _id: { $in: workout.exercises } });

  workout.exercises = exercises

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
    workoutData.username = req.user.username
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

    // check if this works properly

    // Find users with the workout in favorites
    const usersToUpdate = await User.find({ favorites: id });

    // Remove workout ID from users' favorites
    await Promise.all(usersToUpdate.map(async (user) => {
      if (user && user.favorites) { // Check if user exists and has favorites
        user.favorites = user.favorites.filter((favorite) => favorite && favorite.toString() !== id);
        await user.save();
      }
    }));



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
  const workoutData = req.body
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Workout not found' })
  }
  
  try {
    workoutData.exercises = workoutData.exercises.map(exercise => exercise._id)
    console.log('workoutData.exercises: ', workoutData.exercises);
    // Find the workout by ID
    const workout = await Workout.findOne({ _id: id });

    console.log('workout.exercises: ', workout.exercises);
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    // Identify deleted exercises
    const deletedExercises = workout.exercises.filter(exerciseId => !workoutData.exercises.includes(exerciseId));

    // Delete the deleted exercises
    await Exercise.deleteMany({ _id: { $in: deletedExercises } });

    // Update or add new exercises
    const updatedExercises = workoutData.exercises.filter(exerciseId => !workout.exercises.includes(exerciseId));

    await Promise.all(updatedExercises.map(async exerciseId => {
      // Assuming you have an Exercise model
      const exercise = await Exercise.findOne({ _id: exerciseId });

      if (exercise) {
        exercise.title = workoutData.exercises.find(ex => ex._id === exerciseId).title;
        exercise.imgUrl = workoutData.exercises.find(ex => ex._id === exerciseId).imgUrl;
        exercise.videoUrl = workoutData.exercises.find(ex => ex._id === exerciseId).videoUrl;
        exercise.sets = workoutData.exercises.find(ex => ex._id === exerciseId).sets;
        exercise.reps = workoutData.exercises.find(ex => ex._id === exerciseId).reps;
        exercise.weight = workoutData.exercises.find(ex => ex._id === exerciseId).weight;
        await exercise.save();
      }
    }));


    // Update workout data
    workout.title = workoutData.title;
    workout.imgUrl = workoutData.imgUrl;
    workout.Private = workoutData.Private;

    // Save the updated workout
    await workout.save();

    res.status(200).json(workout);
  } catch (error) {
    console.error('Error updating workout:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add workout to favorites
const addFavorite = async (req, res) => {
  const user = req.user
  console.log('user: ', user);
  const workout_id = req.params.id
  console.log('workout_id: ', workout_id);

  try {
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    if (user.favorites.includes(workout_id)) {
      return res.status(400).json({ message: 'Workout already in favorites.' })
    }
    user.favorites.push(workout_id)

    const workout = await Workout.findById(workout_id)
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    workout.likes = (workout.likes || 0) + 1;

    await Promise.all([user.save(), workout.save()])

    res.status(200).json({ message: 'Workout added to favorites successfully.' })
  } catch (error) {
    console.error('Error adding workout to favorites:', error)
    res.status(500).json({ message: 'Internal server error.' })
  }
}

const removeFavorite = async (req, res) => {
  const user = req.user
  const workout_id = req.params.id

  try {
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    if (!user.favorites.includes(workout_id)) {
      return res.status(400).json({ message: 'Workout is not in favorites.' })
    }
    // Remove workout from favorites
    user.favorites = user.favorites.filter((favorite) => favorite.toString() !== workout_id)

    const workout = await Workout.findById(workout_id)
    if (workout) {
      workout.likes = Math.max((workout.likes || 0) - 1, 0); // Decrement likes count, but not below 0
      await workout.save();
    }

    await user.save()

    res.status(200).json({ message: 'Workout removed from favorites successfully.' })
  } catch (error) {
    console.error('Error removing workout from favorites:', error)
    res.status(500).json({ message: 'Internal server error.' })
  }
}



// check lookup function to connect 2 collections for favorites
// const workout = await Workout.findMany({ $lookup: [{from: "workouts",  localField: "user_id",  foreignField: "isfavorite",  as: "favorite",}]})

module.exports = {
  getAllWorkouts,
  getMyWorkouts,
  getWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout,
  getFavoriteWorkouts,
  addFavorite,
  removeFavorite,
}