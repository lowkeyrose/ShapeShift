const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '4h' })
}

// login status
// const loginStatus = async (req, res) => {
//   const data = jwt.decode(req.headers.authorization, process.env.SECRET)
//   console.log('req.user: ', req.user)
//   const user = req.user
//   res.status(200).json({user})
// }

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

    res.status(200).json({ email, token, roleType })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = { loginUser, signupUser }
// module.exports = { loginUser, signupUser, loginStatus }