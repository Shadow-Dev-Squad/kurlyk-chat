import { createMessage, Message } from './components/message'

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

    const message: Message = {
      text: $input.value,
      date: String(new Date()),
    }

    $messages.appendChild(createMessage(message))

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

    const messageData = JSON.parse(data) as Message
    $messages.append(createMessage(messageData, true))
    $messages.scrollTo(0, $messages.scrollHeight)
  }

  ws.onclose = () => {
    // eslint-disable-next-line no-console
    console.log('connection closed')
  }
}

function initApp() {
  const { $messages } = initChat()
  initSockets($messages)
}

window.addEventListener('load', initApp)
