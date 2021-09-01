import { Message } from './components/Message'
import {
  IMessage,
  WsMessage,
  WsMessageConnection,
  WsMessageMessage,
  WsMessageTypes,
} from './types'
import { state } from './state'

const socketHost = process.env.WS_HOST

const selectors = {
  form: '#hello_form',
  nickInput: '.chat__hello-input',
  messages: '.chat__messages',
  chatInput: '.chat__input',
  chatBody: '.chat__body',
  helloBody: '.chat__hello-body',
  status: '.chat__status',
}

function openBody() {
  state.$dom.$body && state.$dom.$body.classList.remove('hidden')
}

function hideHelloBody() {
  state.$dom.$helloBody && state.$dom.$helloBody.classList.add('hidden')
}

function toggleOnlineStatus(value: boolean) {
  if (!state.$dom.$status) return

  if (value) {
    state.$dom.$status.classList.add('chat__status_active')
  }
}

function parseMessage({ data }: { data: unknown }) {
  if (!data || typeof data !== 'string') return

  const message = JSON.parse(data) as WsMessage
  switch (message.type) {
    case WsMessageTypes.message:
      if (!state.$dom.$messages) return

      state.$dom.$messages.append(Message.create(message.payload, true))
      state.$dom.$messages.scrollTo(0, state.$dom.$messages.scrollHeight)
      break

    case WsMessageTypes.userList:
      state.users = message.payload.users.filter(
        (userName) => userName !== state.userId
      )
      break
  }
}

function initSockets(nickName: string) {
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

    hideHelloBody()
    openBody()

    toggleOnlineStatus(true)
  }

  ws.onmessage = parseMessage

  ws.onclose = () => {
    toggleOnlineStatus(false)
  }

  return ws
}

function waitNickname(): Promise<string> {
  return new Promise((resolve) => {
    const $form = document.querySelector(selectors.form)
    if (!$form) return

    $form.addEventListener('submit', (e) => {
      e.preventDefault()
      const $input = document.querySelector(
        selectors.nickInput
      ) as HTMLInputElement
      if (!$input && !$input.value) return

      resolve($input.value)
    })
  })
}

function initMessageInput(ws: WebSocket) {
  if (!state.$dom.$messageInput || !state.$dom.$messages) return null

  state.$dom.$messageInput.addEventListener('keydown', (e) => {
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

    state.$dom.$messages.appendChild(Message.create(message))

    const wsMessage: WsMessageMessage = {
      type: WsMessageTypes.message,
      to: state.users[0],
      from: state.userId,
      payload: message,
    }

    ws.send(JSON.stringify(wsMessage))

    $input.value = ''
  })
}

function initDom() {
  customElements.define('chat-message', Message)

  state.$dom.$messages = document.querySelector(selectors.messages)
  state.$dom.$messageInput = document.querySelector(selectors.chatInput)
  state.$dom.$status = document.querySelector(selectors.status)
  state.$dom.$body = document.querySelector(selectors.chatBody)
  state.$dom.$helloBody = document.querySelector(selectors.helloBody)
}

async function initApp() {
  initDom()

  const ws = initSockets(await waitNickname())
  initMessageInput(ws)
}

window.addEventListener('load', initApp)
