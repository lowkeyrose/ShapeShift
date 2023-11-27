const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {

  // verify authentication
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' })
  }
  
  // 'Bearer dr328959gnjdsf921kdsk200gloe024id92k.sksdfskgrji2'
  // so we need to split this string and grab only the token
  
  const token = authorization.split(' ')[1]
  
  try {
    const { _id } = jwt.verify(token, process.env.SECRET)
    const data = jwt.decode(token, process.env.SECRET)
    req.user = await User.findOne({ _id }).select('_id')
    res.send(data)
    console.log(req.user)
    next()

  } catch (error) {
    console.log(error)
    res.status(401).json({ error: 'Request is not authorized' })
  }
}

module.exports = requireAuth