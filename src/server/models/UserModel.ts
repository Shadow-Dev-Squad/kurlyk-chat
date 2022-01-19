const mongoose = require('mongoose')

const UserModel = mongoose.model(
  'User',
  new mongoose.Schema({
    username: String,
    email: String,
    password: String
  })
)

module.exports = UserModel
