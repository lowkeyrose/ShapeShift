const jwt = require('jsonwebtoken')
const { User } = require('../models/userModel')

module.exports = async (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    return null
  }

  try {
    const { _id, exp } = jwt.verify(token, process.env.SECRET)
    req.user = await User.findOne({ _id })

    const currentTimeInSeconds = Math.floor(Date.now() / 1000); // Convert current time to seconds  
    const timeLeftInSeconds = exp - currentTimeInSeconds;  
    const oneHourInSeconds = 3600; // 1 hour = 60 minutes * 60 seconds  
    if (timeLeftInSeconds < oneHourInSeconds) {  
      // Generate a new token
      const newToken = jwt.sign({ _id }, process.env.SECRET, { expiresIn: '4h' })
  
      // Attach the new token to the response headers
      res.setHeader('Authorization', newToken)
    }

    next()

  } catch (error) {
    console.log(error)
    res.status(401).json({ error: 'Request is not authorized' })
  }
}