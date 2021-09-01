export interface Message {
  id?: string
  date: string
  text: string
}

function createDiv(): HTMLDivElement {
  return document.createElement('div') as HTMLDivElement
}

function createMessageText(text): HTMLDivElement {
  const $messageText = createDiv()
  $messageText.classList.add('chat__message-text')
  $messageText.innerText = text
  return $messageText
}

function createMessageDate(date): HTMLDivElement {
  const $messageText = createDiv()
  $messageText.classList.add('chat__message-date')
  $messageText.innerText = date
  return $messageText
}

export function createMessage(
  message: Message,
  received = false
): HTMLDivElement {
  const $message = createDiv()
  $message.classList.add('chat__message')
  if (received) {
    $message.classList.add('chat__message_from')
  }

  $message.append(createMessageDate(message.date))
  $message.append(createMessageText(message.text))

  return $message
}
