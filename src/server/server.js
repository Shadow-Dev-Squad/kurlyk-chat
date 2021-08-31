const Websocket = require('ws')
const wsServer = new Websocket.Server({ port: 9000 })
wsServer.on('connection', onConnect)

function onConnect(wsClient) {
  // eslint-disable-next-line no-console
  console.log('connection success')
  setInterval(() => {
    const someComplexObject = {
      id: 'someuniqueid123',
      text: `some biba text ${Math.random()}`,
      date: new Date()
    }
    const messageToClient = JSON.stringify(someComplexObject)
    wsClient.send(messageToClient)
  }, 1000)

  wsClient.on('message', function(message) {
    // eslint-disable-next-line no-console
    console.log('message received', message)
  })

  wsClient.on('close', function() {
    // eslint-disable-next-line no-console
    console.log('connection closed')
  })
}