import express = require('express')
const app = express()

import { checkDuplicateUsernameOrEmail } from '../middleware/AuthHelper'
import controller = require('../controllers/AuthController')

app.post(
  '/api/auth/sign-up',
  [checkDuplicateUsernameOrEmail],
  controller.signup
)

app.post('/api/auth/sign-in', controller.signin)

export { app as AuthRoute }
