const mongoose = require("mongoose")

function dbConnection() {
  mongoose.connect(process.env.MONGO_URI)
  .then(() => {
      console.log('Successfully connected to DB')
    })
  .catch((error) => {
    console.log(error)
  })
}

module.exports = dbConnection