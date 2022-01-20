import mongoose = require('mongoose')

export const UserModel = mongoose.model(
  'User',
  new mongoose.Schema({
    username: String,
    email: String,
    password: String
  })
)
