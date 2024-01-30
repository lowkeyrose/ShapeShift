const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
const Joi = require('joi')

// Function to save the user without the password property before returning it
const userWithoutPassword = (user) => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  username: user.username,
  phone: user.phone,
  profilePic: user.profilePic,
  gender: user.gender,
  roleType: user.roleType,
  favorites: user.favorites
})

const userValidationSchema = Joi.object({
  firstName: Joi.string().min(3).max(20).required()
    .pattern(/^[a-zA-Z]+$/)
    .messages({ 'string.pattern.base': '"first name" must contain only alphanumeric characters' }),
  lastName: Joi.string().min(3).max(20).required()
    .pattern(/^[a-zA-Z]+$/)
    .messages({ 'string.pattern.base': '"last name" must contain only alphanumeric characters' }),
  username: Joi.string().min(3).max(20).required(),
  email: Joi.string().min(7).max(62).required().email({ tlds: false }),
  password: Joi.string().required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d.*\d.*\d.*\d)(?=.*[!@#$%^&*_'-])[A-Za-z\d!@#$%^&*_'-]{8,30}$/)
    .message('user "password" must be at least 8 characters long and contain an uppercase letter, a lowercase letter, 4 numbers, and one of the following characters !@#$%^&*_-'),
  phone: Joi.string().required()
    .pattern(/^[0-9]{10,15}$/)
    .messages({ 'string.pattern.base': 'Phone number must have between 10-15 digits.' }),
  gender: Joi.string().required(),
  roleType: Joi.any(),
  profilePic: Joi.any()
})

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
  phone: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  profilePic: {
    type: String,
  },
  roleType: {
    type: String,
    default: 'user',
    required: true
  },
  favorites: [{
    type: String
  }]
})

// Static signup method
userSchema.statics.signup = async function (firstName, lastName, email, password, username, phone, profilePic, gender, roleType) {
  try {
    await userValidationSchema.validateAsync({ firstName, lastName, email, password, username, phone, profilePic, gender, roleType })

    const emailTaken = await this.findOne({ email })
    if (emailTaken) {
      throw new Error('email already in use')
    }

    const usernameTaken = await this.findOne({ username })
    if (usernameTaken) {
      throw new Error('username already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await this.create({ firstName, lastName, email, password: hash, username, phone, profilePic, gender, roleType })
    const filteredUser = userWithoutPassword(user)

    return filteredUser
  } catch (error) {
    throw error
  }
}

// Static login method
userSchema.statics.login = async function (email, password) {
  try {
    await Joi.object({
      email: Joi.string().max(62).required().email({ tlds: false }),
      password: Joi.string().required(),
    }).validateAsync({ email, password })

    const user = await this.findOne({ email })
    if (!user) {
      throw new Error('Invalid login credentials')
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      throw new Error('Invalid login credentials')
    }

    const filteredUser = userWithoutPassword(user)

    return filteredUser
  } catch (error) {
    throw error
  }
}

const User = mongoose.model('User', userSchema)

module.exports = { User, userWithoutPassword }