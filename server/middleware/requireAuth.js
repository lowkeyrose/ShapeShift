const jwt = require('jsonwebtoken');
const { User } = require('../models/userModel')

module.exports = async (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    return null
  }

  try {
    const { _id } = jwt.verify(token, process.env.SECRET)
    req.user = await User.findOne({ _id })
    next()

  } catch (error) {
    console.log(error)
    res.status(401).json({ error: 'Request is not authorized' })
  }
}