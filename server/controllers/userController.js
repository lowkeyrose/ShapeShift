const { User, userWithoutPassword } = require('../models/userModel')
const Workout = require('../models/workoutModel')
const Exercise = require('../models/exerciseModel')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

// Create token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '4h' })
}

// Authenticate
const authenticate = async (req, res) => {
  const user = req.user
  const filteredUser = userWithoutPassword(user)
  res.status(200).json(filteredUser)
}

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.login(email, password)
    const token = createToken(user._id)
    res.status(200).json({ user, token })
  } catch (error) {
    console.error('Error in loginUser: ',error)
    res.status(400).json({ error: error.message })
  }
}

// Signup user
const signupUser = async (req, res) => {
  const { firstName, lastName, email, password, username, phone, profilePic, gender, roleType } = req.body

  try {
    const user = await User.signup(firstName, lastName, email, password, username, phone, profilePic, gender, roleType)
    const token = createToken(user._id)
    res.status(200).json({ user, token })
  } catch (error) {
    console.error('Error in signupUser: ',error)
    res.status(400).json({ error: error.message })
  }
}

// update user
const updateUser = async (req, res) => {
  const userData = req.body

  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'User not found' })
  }
  
  try {
    const user = await User.findOne({ _id: userData._id })
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.firstName !== userData.firstName) {
      user.firstName = userData.firstName;
    }
    
    if (user.lastName !== userData.lastName) {
      user.lastName = userData.lastName;
    }
    
    if (user.email !== userData.email) {
      user.email = userData.email;
    }
    
    if (user.username !== userData.username) {
      user.username = userData.username;
    }
    
    if (user.phone !== userData.phone) {
      user.phone = userData.phone;
    }
    
    if (user.gender !== userData.gender) {
      user.gender = userData.gender;
    }
    
    if ((user.roleType !== userData.roleType) && (userData.roleType !== '')) {
      user.roleType = userData.roleType;
    }
    
    if (user.profilePic !== userData.profilePic) {
      user.profilePic = userData.profilePic;
    }
    
    await user.save();
    
    const filteredUser = userWithoutPassword(user)
    
    res.status(200).json(filteredUser)
  } catch (error) {
    console.error('Error in updateUser: ',error)
    res.status(400).json({ error: error.message })
  }
  
}

// Delete user
const deleteUser = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Workout not found' })
  }

  if (req.user._id.toString() !== id  && req.user.roleType !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized user' })
  }

  try {
    const user = await User.findOne({ _id: id })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Save all the user's workouts
    const userWorkouts = await Workout.find({ user_id: id });
    // Convert to string for comparison
    const workoutIds = userWorkouts.map((workout) => String(workout._id))

    // Remove user's workouts from other users' favorites
    await User.updateMany(
      { favorites: { $in: workoutIds } },
      { $pull: { favorites: { $in: workoutIds } } }
    );

    // Delete all user's workouts
    await Workout.deleteMany({ user_id: id });

    // Delete all user's exercises
    await Exercise.deleteMany({ user_id: id });

    // Delete the user
    await User.deleteOne({ _id: id });

    const filteredUser = userWithoutPassword(user)

    res.status(200).json(filteredUser)
  } catch (error) {
    console.error('Error in deleteUser: ',error)
    res.status(500).json({ success: false, error: error.message });
  }
}

// Admin get user
const getUser = async (req, res) => {
  if (req.user.roleType !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'User not found' })
  }

  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const filteredUser = userWithoutPassword(user)
    res.status(200).json(filteredUser)
  } catch (error) {
    console.error('Error in getUser:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Admin Get all users
const getUsers = async (req, res) => {

  if (!req.user.roleType === 'admin') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const users = await User.find({}).sort({ createdAt: -1 })

    const filteredUsers = users.map((user) => userWithoutPassword(user))

    res.status(200).json(filteredUsers)
  } catch (error) {
    console.error('Error fetching all users:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

module.exports = {
  loginUser,
  signupUser,
  authenticate,
  updateUser,
  getUsers,
  deleteUser,
  getUser
}