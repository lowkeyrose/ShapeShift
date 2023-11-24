const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  gender: {
    type: String,
    required: true
  },
  profilePic: {
    type: String,
  }
})

// static signup method
userSchema.statics.signup = async function (firstName, lastName, email, password, username, phone, profilePic, gender) {

  // validation
  if (!firstName || !lastName || !email || !password || !username || !phone || !gender) {
    throw Error('All fields must be filled')
  }

  if (!validator.isEmail(email)) {
    throw Error('Email is not valid')
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password is not strong enough')
  }

  const emailTaken = await this.findOne({ email })

  if (emailTaken) {
    throw Error('Email already in use')
  }

  const usernameTaken = await this.findOne({ username })

  if (usernameTaken) {
    throw Error('username already in use')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const user = await this.create({ firstName, lastName, email, password: hash, username, phone, profilePic, gender })

  return user
}

//  static login method
userSchema.statics.login = async function (email, password) {

  // validation
  if (!email || !password) {
    throw Error('All fields must be filled')
  }

  const user = await this.findOne({ email })

  if (!user) {
    throw Error('Invalid login credentials')
  }

  const match = await bcrypt.compare(password, user.password)

  if (!match) {
    throw Error('Invalid login credentials')
  }

  return user
}

module.exports = mongoose.model('User', userSchema)