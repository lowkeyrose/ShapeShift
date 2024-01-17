const Joi = require('joi');


const workoutValidationSchema = Joi.object({
  title: Joi.string().min(3).max(20).required(),
  imgUrl: Joi.string().uri().max(2000).optional(),
  exercises: Joi.array().min(1).max(30).required(),
  Private: Joi.boolean().default(false).optional(),
});

const exerciseValidationSchema = Joi.object({
  title: Joi.string().min(3).max(20).required(),
  imgUrl: Joi.string().min(0).max(2000).optional(),
  videoUrl: Joi.string().min(0).max(2000).optional(),
  sets: Joi.number().min(1).max(200).required(),
  weight: Joi.number().min(0).max(1000).required(),
  reps: Joi.number().min(1).max(200).required()
});

module.exports = async (req, res, next) => {
  try {
    const { title, imgUrl, exercises, Private } = req.body
    const exerciseErrors = [];

    exercises.map((exercise) => {
      const { title, imgUrl, videoUrl, sets, weight, reps } = exercise
      const { error: exercisesError, value: exercisesValue } = exerciseValidationSchema.validate({title, imgUrl, videoUrl, sets, weight, reps });
      if (exercisesError) {
        exerciseErrors.push(exercisesError.message);
      }
    })

    if (exerciseErrors.length > 0) {
      return res.status(400).json({ error: exerciseErrors });
    }
    const { error, value } = workoutValidationSchema.validate({ title, imgUrl, exercises, Private });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    req.validatedData = value;

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}