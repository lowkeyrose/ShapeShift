const mongoose = require('mongoose')
const Schema = mongoose.Schema
// const Joi = require('joi');

// const exerciseValidationSchema = Joi.object({
//   title: Joi.string().min(3).max(20).required(),
//   imgUrl: Joi.string().uri().max(2000).optional(),
//   videoUrl: Joi.string().uri().max(2000).optional(),
//   sets: Joi.number().min(1).max(200).required(),
//   weight: Joi.number().min(0).max(1000).required(),
//   reps: Joi.number().min(1).max(200).required()
// });

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

// module.exports = {
//   Exercise: mongoose.model('Exercise', exerciseSchema),
//   exerciseValidationSchema: exerciseValidationSchema
// };