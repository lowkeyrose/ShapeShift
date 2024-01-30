const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
    type: mongoose.Schema.Types.ObjectId,
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