import jwt = require('jsonwebtoken')
import bcrypt = require('bcryptjs')
import { UserModel as User } from '../models/UserModel'

export const signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })

  user.save((err) => {
    if (err) {
      res.status(500).send({ message: err })
    }
  })

  res.send({ message: 'User was registered successfully!' })
}

export const signin = (req, res) => {
  User.findOne(
    {
      username: req.body.username
    },
    (err, user) => {
      if (err) {
        res.status(500).send({ message: err })
        return
      }

      if (!user) {
        return res.status(404).send({ message: 'User Not found.' })
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      )

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid Password!'
        })
      }

      const token = jwt.sign({ id: user.id }, 'secret-key', {
        expiresIn: 86400
      })

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        accessToken: token
      })
    }
  )
}
