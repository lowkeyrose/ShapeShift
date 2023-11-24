require('dotenv').config()
const express = require('express')
const dbConnection = require("./utils/db")
const cors = require('cors');
const userRoutes = require('./routes/user')
const workoutRoutes = require('./routes/workouts')
const exerciseRoutes = require('./routes/exercise')

// Connecting to database
dbConnection();

// express app
const app = express()

// middleware
app.use(express.json())

app.use(cors({
  origin: true,
  credentials: true,
  methods: 'GET,PUT,POST,DELETE',
  allowedHeaders: 'Content-Type, Accept, Authorization',
}));

// log
app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
app.use('/api/workouts', workoutRoutes)
app.use('/api/exercises', exerciseRoutes)
app.use('/api/user', userRoutes)

// listen for requests
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}...`)
})
