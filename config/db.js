const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connection.on('connected', () => {
  console.error.bind(console, 'Mongoose connected!')
})

mongoose.connection.on('disconnected', () => {
  console.error.bind(console, 'Mongoose disconnected!')
})

mongoose.connection.on('error', () => {
  console.error.bind(console, 'MongoDB connection error:')
})
