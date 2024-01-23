const mongoose = require('mongoose')
const Schema = mongoose.Schema

const exerciseSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  imgUrl: {
    type: String
  },
  videoUrl: {
    type: String
  },
  sets: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  reps: {
    type: Number,
  },
  duration: {
    type: String,
  },
  workout_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Exercise', exerciseSchema)