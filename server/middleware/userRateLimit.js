const express = require('express')
const jwt = require('jsonwebtoken')
const { User } = require('../models/userModel')

const MAX_REQUESTS_PER_DAY = 1000
const TIME_WINDOW_IN_MS = 24 * 60 * 60 * 1000 // 24 hours

const userRequests = {} // Store user request counts and timestamps

module.exports = async (req, res, next) => {
  const token = req.headers.authorization

  try {
    if (token) {
      const { _id } = jwt.verify(token, process.env.SECRET)

      // Initialize user request count if not present
      if (!userRequests[_id]) {
        userRequests[_id] = { count: 0, lastRequestTime: Date.now() }
      }

      const { count, lastRequestTime } = userRequests[_id]

      // Check if the last request was made within the time window
      const elapsedTime = Date.now() - lastRequestTime

      if (elapsedTime < TIME_WINDOW_IN_MS) {
        // Check if the user has exceeded the maximum requests
        if (count >= MAX_REQUESTS_PER_DAY) {
          return res.status(429).json({ error: 'Too Many Requests' })
        }
      } else {
        // Reset the count if the time window has passed
        userRequests[_id] = { count: 0, lastRequestTime: Date.now() }
      }

      // Increment the request count and update the timestamp
      userRequests[_id].count += 1
      userRequests[_id].lastRequestTime = Date.now()

      req.user = await User.findOne({ _id })
    }
    next()

  } catch (error) {
    console.error(error)
    res.status(401).json({ error: 'Request is not authorized' })
  }
}
