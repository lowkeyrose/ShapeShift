const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Exercise = require('./exerciseModel')

const workoutSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  imgUrl: {
    type: String
  },
  exercises: [Exercise.schema],
  Private: {
    type: Boolean
  },
  user_id: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Workout', workoutSchema)