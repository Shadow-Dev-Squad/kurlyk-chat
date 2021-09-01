import { IMessage } from '../types'

export class Message extends HTMLElement {
  $date: HTMLDivElement
  $message: HTMLDivElement
  $text: HTMLDivElement

  constructor() {
    super()

    const $shadow = this.attachShadow({ mode: 'open' })
    const received = !!this.getAttribute('received')

    this.$message = this.createMessage(
      {
        date: this.getAttribute('date'),
        text: this.getAttribute('text'),
      },
      received
    )

    const $styles = document.createElement('style')
    $styles.innerText = this.styles()

    $shadow.append($styles, this.$message)
  }

  createMessage(message: IMessage, received = false) {
    const $message = this.createDiv()
    $message.classList.add('message')
    if (received) {
      $message.classList.add('message_from')
    }

    this.$date = this.createMessageDate(message.date)
    this.$text = this.createMessageText(message.text)

    $message.append(this.$date)
    $message.append(this.$text)

    return $message
  }

  styles() {
    return `
      @keyframes smooth-to-right {
        0% {
          opacity: 0;
          transform: translate(-40px);
        }
        100% {
          opacity: 1;
          transform: translate(0);
        }
      }
      
      .message {
        padding-inline: 10px;
        padding-block: 10px;
        animation: 0.4s smooth-to-right ease-in-out alternate;
        border-radius: 15px;
        margin-top: 10px;
      }
      
      .message:last-child {
        border: none;
      }
      
      .message_from {
        background: #ececec;
      }
      
      .date {
        font-size: 12px;
        color: gray;
      }
      
      .text {
        padding-top: 10px;
      }
    `
  }

  createMessageText(text): HTMLDivElement {
    const $messageText = this.createDiv()
    $messageText.classList.add('text')
    $messageText.innerText = text
    return $messageText
  }

  createMessageDate(date): HTMLDivElement {
    const $messageText = this.createDiv()
    $messageText.classList.add('date')
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

  // callbacks //

  connectedCallback() {
    // eslint-disable-next-line no-console
    console.log('connected message')
    this.$text.innerText = this.getAttribute('text')
    this.$date.innerText = this.getAttribute('date')
    if (this.getAttribute('received')) {
      this.$message.classList.add('message_from')
    }
  }

  disconnectedCallback() {
    // eslint-disable-next-line no-console
    console.log('disconnected')
  }

  adoptedCallback() {
    // eslint-disable-next-line no-console
    console.log('adopted message')
  }

  attributeChangedCallback() {
    // eslint-disable-next-line no-console
    console.log('watch attribute callback')
  }
}
