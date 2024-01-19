const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '4h' })
}

// authenticate
const authenticate = async (req, res) => {
  const user = req.user
  res.status(200).json(user)
}

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body
  console.log("req.body", req.body);

  try {
    const user = await User.login(email, password)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({ user, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
    console.log(error);
  }
}

// signup user
const signupUser = async (req, res) => {
  const { firstName, lastName, email, password, username, phone, profilePic, gender, roleType } = req.body

  try {
    const user = await User.signup(firstName, lastName, email, password, username, phone, profilePic, gender, roleType)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({ user, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// update user
const updateUser = async (req, res) => {
  const userData = req.body
  // console.log('userData: ', userData);
  const { id } = req.params
  // console.log('user._id: ', userData._id);

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'User not found' })
    }

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

    if (user.profilePic !== userData.profilePic) {
      user.profilePic = userData.profilePic;
    }

    await user.save();

    res.status(200).json({ user })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }

}


// Admin get user
const getUser = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'User not found' })
    }

    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.status(200).json(user)
  } catch (error) {
    console.error('Error in getUser:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Admin Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });

    const filteredUsers = users.filter(user => user.roleType !== 'admin');

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// Admin Delete user
const deleteUser = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Workout not found' })
  }

  try {
    const user = await User.findOneAndDelete({ _id: id })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    // Check if admin / either this or make middleware like requireAuth but for adminAuth
    // if (!req.user.roleType === 'admin') {
    //   return res.status(401).json({ error: 'Unauthorized' })
    // }
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}




module.exports = { loginUser, signupUser, authenticate, updateUser, getUsers, deleteUser, getUser }