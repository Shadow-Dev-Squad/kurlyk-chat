import * as http from 'http'
import { WsMessage, WsMessageTypes, WsMessageUsers } from '../types'

const express = require('express')
const app = express()
const WebSocket = require('ws')
const mongoose = require('mongoose')
const cors = require('cors')
const AuthRoute = require('./routes/AuthRoute')
require('dotenv').config()

app.use(express.static('dist'))
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

wss.on('connection', onConnect)

const connections: { [key: string]: WebSocket } = {}

function getUserList (): WsMessageUsers {
  return {
    type: WsMessageTypes.userList,
    payload: {
      users: Object.keys(connections)
    }
  }
}

function parseWsMessage (
  message: WsMessage,
  client: WebSocket
): string | undefined {
  switch (message.type) {
    case WsMessageTypes.connection: {
      connections[message.payload.id] = client
      const usersMessage = JSON.stringify(getUserList())
      for (const connectedUser of Object.values(connections)) {
        connectedUser.send(usersMessage)
      }
      break
    }

    case WsMessageTypes.message: {
      if (!message.to || !message.from) return

      const toClient = connections[message.to]
      if (!toClient) return

      toClient.send(JSON.stringify(message))
      console.log(`message sent to ${message.to}`)
      break
    }
  }
}

function onConnect (wsClient) {
  let connectionId

  wsClient.on('message', (message) => {
    const parsedMessage = JSON.parse(message) as WsMessage

    const result = parseWsMessage(parsedMessage, wsClient)
    if (result) connectionId = result
  })

  wsClient.on('close', function () {
    console.log('connection closed')
    if (!connectionId) return

    delete connections[connectionId]
    const usersMessage = JSON.stringify(getUserList())
    for (const connectedUser of Object.values(connections)) {
      connectedUser.send(usersMessage)
    }
  })
}

const allowedOrigins = [process.env.FRONT_URL]

const options = {
  origin: allowedOrigins
}

app.use(cors(options))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  )
  next()
})

app.use(AuthRoute)

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nerlr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)

server.listen(process.env.PORT, () => {
  console.log('Server started on', process.env.PORT)
})
