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
  likes: {
    type: Number
  }
}, { timestamps: true })

module.exports = mongoose.model('Workout', workoutSchema)