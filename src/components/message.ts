export interface IMessage {
  id?: string
  date: string
  text: string
}

export class Message extends HTMLElement {
  constructor() {
    super()

    const $shadow = this.attachShadow({ mode: 'open' })
    const received = !!this.getAttribute('received')

    const $message = this.createMessage(
      {
        date: this.getAttribute('date'),
        text: this.getAttribute('text'),
      },
      received
    )

    $shadow.append($message)
  }

  createMessage(message: IMessage, received = false) {
    const $message = this.createDiv()
    $message.classList.add('chat__message')
    if (received) {
      $message.classList.add('chat__message_from')
    }

    $message.append(this.createMessageDate(message.date))
    $message.append(this.createMessageText(message.text))

    return $message
  }

  createMessageText(text): HTMLDivElement {
    const $messageText = this.createDiv()
    $messageText.classList.add('chat__message-text')
    $messageText.innerText = text
    return $messageText
  }

  createMessageDate(date): HTMLDivElement {
    const $messageText = this.createDiv()
    $messageText.classList.add('chat__message-date')
    $messageText.innerText = date
    return $messageText
  }

  createDiv(): HTMLDivElement {
    return document.createElement('div') as HTMLDivElement
  }

  static create(message: IMessage, received = false): HTMLElement {
    const $chatMessage = document.createElement('chat-message')

    $chatMessage.setAttribute('text', message.text)
    $chatMessage.setAttribute('date', message.date)
    if (received) {
      $chatMessage.setAttribute('received', 'true')
    }

    return $chatMessage
  }
}
