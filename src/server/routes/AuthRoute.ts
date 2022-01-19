const express = require('express')
const app = express()

const helper = require('../middleware/AuthHelper')
const controller = require('../controllers/AuthController')

app.post('/api/auth/sign-up', [helper.checkDuplicateUsernameOrEmail], controller.signup)

app.post('/api/auth/sign-in', controller.signin)

module.exports = app
