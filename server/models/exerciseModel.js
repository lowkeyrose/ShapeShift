const mongoose = require('mongoose')

const Schema = mongoose.Schema

const exerciseSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  imgUrl: {
    type: String,
    default: 'https://hdwallsource.com/img/2019/8/dwayne-johnson-gym-hd-wallpaper-67004-69300-hd-wallpapers.jpg'
  },
  videoUrl: {
    type: String
  },
  sets: {
    type: Number,
    required: true
  },
  weight: {
    // Type: 1 (all same weight), Type: 2 (set weight for each set)
    type: Number,
    required: true
  },
  reps: {
    // Type: 1 (all same rep amount), Type: 2 (set rep amount for each set)
    type: Number,
    required: true
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