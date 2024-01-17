const mongoose = require('mongoose')
const Workout = require('../models/workoutModel')
const Exercise = require('../models/exerciseModel')
const User = require('../models/userModel')

// Get all workouts
const getAllWorkouts = async (_, res) => {
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

  if (!workout) {
    return res.status(404).json({ error: 'Workout not found' })
  }

  const exercises = await Exercise.find({ _id: { $in: workout.exercises } });

  workout.exercises = exercises


  res.status(200).json(workout)
}

// Create new workout
const createWorkout = async (req, res) => {
  console.log('');
  try {
    // Extract workout and exercises data from the request body
    const workoutData = req.body
    let exercisesData = req.body.exercises
    console.log('user details: ', req.user)
    workoutData.user_id = req.user._id
    workoutData.userProfilePic = req.user.profilePic
    workoutData.username = req.user.username
    exercisesData = exercisesData.map(exercises => ({ ...exercises, user_id: workoutData.user_id }))

    // Check if a workout with the same title already exists for the current user
    const existingWorkout = await Workout.findOne({ title: workoutData.title, user_id: workoutData.user_id });

    if (existingWorkout) {
      return res.status(420).json({ success: false, error: 'Title already in use for this user' });
    }

    // Create a new workout
    const newWorkout = await Workout.create(workoutData)

    // Update the workout's exercises field with the created exercise
    const createdExercises = await Exercise.create(exercisesData.map(exercises => ({ ...exercises, workout_id: newWorkout._id })))

    // Update the workout document with the IDs of the created exercises
    newWorkout.exercises = createdExercises.map(exercise => exercise._id)
    await newWorkout.save()

    res.status(201).json({ success: true, workout: newWorkout })

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}



// Delete a workout
const deleteWorkout = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Workout not found' })
  }

  try {
    // Find the workout and store its ID
    const workout = await Workout.findOne({ _id: id })

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' })
    }

    // find if the workout belongs to the user
    if (req.user._id.equals(workout.user_id) || req.user.roleType === 'admin') {

      const deletedWorkout = await Workout.findByIdAndDelete(id);

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
      await Exercise.deleteMany({ workout_id: deletedWorkout._id })
      // console.log('workout supppper: ', workout);
      res.status(200).json(deletedWorkout)
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// Update a workout
const updateWorkout = async (req, res) => {
  const { id } = req.params
  const workoutData = req.body
  const exercisesData = req.body.exercises

  console.log('req.user._id: ', req.user._id);
  console.log('workoutData: ', workoutData);

  // instead of declaring maybe just write workoutData.exercises? but we have multiple cases
  // console.log('workoutData: ', workoutData);
  // console.log('exercisesData: ', exercisesData);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Workout not found' })
  }

  try {
    const workout = await Workout.findOne({ _id: id });
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    // Update or create exercises
    const updatedExercisesIds = await Promise.all(exercisesData.map(async (exercise) => {
      if (exercise._id) {
        // Exercise already has an _id, update it
        const existingExercise = await Exercise.findOne({ _id: exercise._id })
        if (existingExercise) {
          const hasChanges = JSON.stringify(exercise) !== JSON.stringify(existingExercise);

          if (hasChanges) {
            Object.assign(existingExercise, exercise);
            await existingExercise.save();
            return existingExercise._id;
          } else {
            return existingExercise._id;
          }
        }
      } else {
        // Exercise doesn't have an _id, create it
        const newExercise = await Exercise.create({
          ...exercise,
          user_id: workoutData.user_id,
          workout_id: workoutData._id,
        })
        // console.log('newExercise._id: ', newExercise._id);
        return newExercise._id;
      }
    }))

    // console.log('updatedExercisesIds: ', updatedExercisesIds);

    // Identify exercises to be deleted
    const exercisesToDelete = workout.exercises
      .map((exerciseId) => exerciseId.toString())
      .filter((exerciseId) => !updatedExercisesIds.toString().includes(exerciseId));

    // Delete exercises that are no longer present in the updated workout
    await Exercise.deleteMany({ _id: { $in: exercisesToDelete } });

    // Check if the fields have changed before updating
    if (workout.title !== workoutData.title) {
      workout.title = workoutData.title;
    }

    if (workout.imgUrl !== workoutData.imgUrl) {
      workout.imgUrl = workoutData.imgUrl;
    }

    if (workout.Private !== workoutData.Private) {
      workout.Private = workoutData.Private;
    }
    // Update the workout's exercises array with the new/existing exercise IDs
    workout.exercises = updatedExercisesIds;

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