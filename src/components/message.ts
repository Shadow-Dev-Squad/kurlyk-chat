export interface IMessage {
  id?: string
  date: string
  text: string
}

export class Message {
  private readonly $message: HTMLDivElement

  private constructor(private message: IMessage, received) {
    this.$message = this.createDiv()
    this.$message.classList.add('chat__message')
    if (received) {
      this.$message.classList.add('chat__message_from')
    }

    this.$message.append(this.createMessageDate(message.date))
    this.$message.append(this.createMessageText(message.text))
  }

  static create(message: IMessage, received = false): HTMLDivElement {
    return new Message(message, received).getNode()
  }

  getNode() {
    return this.$message
  }

  createDiv(): HTMLDivElement {
    return document.createElement('div') as HTMLDivElement
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
}
