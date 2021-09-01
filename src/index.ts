import { Message, IMessage } from './components/Message'

function initChat() {
  const $messages = document.getElementsByClassName(
    'chat__messages'
  )[0] as HTMLDivElement

  const $messageInput = document.getElementsByClassName(
    'chat__input'
  )[0] as HTMLInputElement

  if (!$messageInput || !$messages) return

  $messageInput.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || !e.currentTarget) return

    const $input = e.currentTarget as HTMLInputElement

    const message: IMessage = {
      text: $input.value,
      date: String(new Date()),
    }

    $messages.appendChild(Message.create(message))

    $input.value = ''
  })

  return {
    $messages,
  }
}

function initSockets($messages: HTMLDivElement) {
  const ws = new WebSocket('ws://localhost:9000')
  ws.onopen = () => {
    // eslint-disable-next-line no-console
    console.log('connection successfully')
  }

  ws.onmessage = ({ data }: { data: unknown }) => {
    if (!data || typeof data !== 'string') return

    const message = JSON.parse(data) as IMessage
    $messages.append(Message.create(message, true))
    $messages.scrollTo(0, $messages.scrollHeight)
  }

  ws.onclose = () => {
    // eslint-disable-next-line no-console
    console.log('connection closed')
  }
}

function initApp() {
  customElements.define('chat-message', Message)
  const { $messages } = initChat()
  initSockets($messages)
}

window.addEventListener('load', initApp)
