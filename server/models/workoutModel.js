const mongoose = require('mongoose')
const Exercise = require('./exerciseModel')
const Schema = mongoose.Schema
// const Joi = require('joi');

// const workoutValidationSchema = Joi.object({
//   title: Joi.string().min(3).max(20).required(),
//   imgUrl: Joi.string().uri().max(2000).optional(),
//   exercises: Joi.array().min(1).max(30).required(),
//   Private: Joi.boolean().default(false).optional(),
// });

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

// module.exports = {
//   Workout: mongoose.model('Workout', workoutSchema),
//   workoutValidationSchema: workoutValidationSchema
// };