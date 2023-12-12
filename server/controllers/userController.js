const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '4h' })
}
// login status
const loginStatus = async (req, res) => {
  try {
    res.status(200).json(req.user)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.login(email, password)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({ email, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
    console.log(error);
  }
}

// signup user
const signupUser = async (req, res) => {
  const { firstName, lastName, email, password, username, phone, profilePic, gender } = req.body

  try {
    const user = await User.signup(firstName, lastName, email, password, username, phone, profilePic, gender)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({ email, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = { loginUser, signupUser, loginStatus }