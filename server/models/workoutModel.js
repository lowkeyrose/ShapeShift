const mongoose = require('mongoose')
const Exercise = require('./exerciseModel')
const Schema = mongoose.Schema
const Joi = require('joi');

const workoutSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  imgUrl: {
    type: String
  },
  exercises: [{
    type: Object,
    ref: 'Exercise'
  }],
  Private: {
    type: Boolean,
    default: false
  },
  user_id: {
    type: Object,
    required: true
  },
  username: {
    type: String
  },
  userProfilePic:{
    type: String
  },
  likes: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

module.exports = mongoose.model('Workout', workoutSchema)