import { Server } from 'mock-socket'

export const createServer = (url, callback) => {
  const mockServer = new Server(url)
  mockServer.on('connection', (connection) => {
    callback(connection)
  })
}
