import * as express from 'express'
import * as http from 'http'
const WebSocket = require('ws')

import { WsMessage, WsMessageTypes, WsMessageUsers } from '../types'

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

wss.on('connection', onConnect)

const connections: { [key: string]: WebSocket } = {}

function getUserList(): WsMessageUsers {
  return {
    type: WsMessageTypes.userList,
    payload: {
      users: Object.keys(connections),
    },
  }
}

function parseWsMessage(
  message: WsMessage,
  client: WebSocket
): string | undefined {
  switch (message.type) {
    case WsMessageTypes.connection:
      connections[message.payload.id] = client
      const usersMessage = JSON.stringify(getUserList())
      for (const connectedUser of Object.values(connections)) {
        connectedUser.send(usersMessage)
      }
      break

    case WsMessageTypes.message:
      if (!message.to || !message.from) return

      const toClient = connections[message.to]
      if (!toClient) return

      toClient.send(JSON.stringify(message))
      console.log(`message sent to ${message.to}`)
      break
  }
}

function onConnect(wsClient) {
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
server.listen(9000, () => {
  console.log('server started on localhost:9000')
})
