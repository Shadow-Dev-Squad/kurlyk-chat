import { Message } from './components/Message'
import {
  IMessage,
  WsMessage,
  WsMessageConnection,
  WsMessageMessage,
  WsMessageTypes,
} from './types'

const socketHost = process.env.WS_HOST

const $dom = {
  form: '#hello_form',
  nickInput: '.chat__hello-input',
  messages: '.chat__messages',
  chatInput: '.chat__input',
  chatBody: '.chat__body',
  helloBody: '.chat__hello-body',
}

interface State {
  users: string[]
  userId: string
}

const state: State = {
  users: [],
  userId: null,
}

function initSockets($messages: HTMLDivElement, nickName: string) {
  const ws = new WebSocket(socketHost)
  state.userId = nickName

  ws.onopen = () => {
    const connectionMessage: WsMessageConnection = {
      type: WsMessageTypes.connection,
      payload: {
        id: nickName,
      },
    }

    ws.send(JSON.stringify(connectionMessage))
  }

  ws.onmessage = ({ data }: { data: unknown }) => {
    if (!data || typeof data !== 'string') return

    const message = JSON.parse(data) as WsMessage
    switch (message.type) {
      case WsMessageTypes.message:
        $messages.append(Message.create(message.payload, true))
        $messages.scrollTo(0, $messages.scrollHeight)
        break

      case WsMessageTypes.userList:
        state.users = message.payload.users.filter(
          (userName) => userName !== nickName
        )
        break
    }
  }

  ws.onclose = () => {}

  return ws
}

function waitNickname(): Promise<string> {
  return new Promise((resolve) => {
    const $form = document.querySelector($dom.form)
    if (!$form) return

    $form.addEventListener('submit', (e) => {
      e.preventDefault()
      const $input = document.querySelector($dom.nickInput) as HTMLInputElement
      if (!$input && !$input.value) return

      const $body = document.querySelector($dom.chatBody)
      $body && $body.classList.remove('hidden')

      const $helloBody = document.querySelector($dom.helloBody)
      $helloBody && $helloBody.classList.add('hidden')
      resolve($input.value)
    })
  })
}

function initMessageInput(
  $messages: HTMLDivElement,
  $messageInput: HTMLDivElement,
  ws: WebSocket
): HTMLDivElement | null {
  if (!$messageInput || !$messages) return null

  $messageInput.addEventListener('keydown', (e) => {
    if (
      e.key !== 'Enter' ||
      !e.currentTarget ||
      !state.users.length ||
      !state.userId
    )
      return

    const $input = e.currentTarget as HTMLInputElement

    const message: IMessage = {
      text: $input.value,
      date: String(new Date()),
    }

    $messages.appendChild(Message.create(message))

    const wsMessage: WsMessageMessage = {
      type: WsMessageTypes.message,
      to: state.users[0],
      from: state.userId,
      payload: message,
    }

    ws.send(JSON.stringify(wsMessage))

    $input.value = ''
  })

  return $messages
}

async function initApp() {
  customElements.define('chat-message', Message)

  const $messages = document.querySelector($dom.messages) as HTMLDivElement
  const $messageInput = document.querySelector($dom.chatInput) as HTMLDivElement
  const nickName = await waitNickname()

  if (!$messages) return
  const ws = initSockets($messages, nickName)
  initMessageInput($messages, $messageInput, ws)
}

window.addEventListener('load', initApp)
