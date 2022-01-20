export class SocketService {
  subscribers: { [key: string]: Array<(arg: unknown) => void> } = {}
  ws

  constructor(socketHost: string) {
    this.ws = new WebSocket(socketHost)
    this.ws.onopen = (event) => this.emit('open', event)
    this.ws.onclose = (event) => this.emit('close', event)
    this.ws.onmessage = (event) => this.emit('message', event)
  }

  emit(action: string, event: unknown) {
    const subscribers = this.subscribers[action]
    if (!subscribers) return

    subscribers.forEach((subscriber) => {
      subscriber(event)
    })
  }

  on(action: string, fn: (arg) => void) {
    if (!this.subscribers[action]) this.subscribers[action] = []

    this.subscribers[action].push(fn)
  }

  send(message) {
    this.ws.send(JSON.stringify(message))
  }
}
