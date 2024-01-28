require('dotenv').config()
const express = require('express')
const dbConnection = require("./utils/db")
const cors = require('cors')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const userRoutes = require('./routes/user')
const workoutRoutes = require('./routes/workouts')

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// Connecting to database
dbConnection();

// express app
const app = express()

// middleware
app.use(express.json())

app.use(morgan(':method :url status :status, :response-time ms :date[web]', { stream: accessLogStream }))

app.use(cors({
  origin: true,
  credentials: true,
  methods: 'GET,PUT,POST,DELETE',
  allowedHeaders: 'Content-Type, Accept, Authorization',
}));

// log requests in terminal
app.use((req, _, next) => {
  console.log(`Route: ${req.path}, Method: ${req.method},`)
  next()
})

// routes
app.use('/api/workouts', workoutRoutes)
app.use('/api/user', userRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.message)
  console.error(err.stack)
  res.status(500).send('Something went wrong!')
})

// listen for requests
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}...`)
})