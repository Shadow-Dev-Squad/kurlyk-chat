function createMessage(text: string): HTMLDivElement {
  const $message = document.createElement('div') as HTMLDivElement
  $message.classList.add('chat__message')
  $message.innerText = text
  return $message
}

function initChat() {
  // const $chat = document.getElementsByClassName('chat')
  const $messages = document.getElementsByClassName('chat__messages')[0] as HTMLDivElement
  const $messageInput = document.getElementsByClassName('chat__input')[0] as HTMLInputElement

  if (!$messageInput || !$messages) return

  $messageInput.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || !e.currentTarget) return

    const $input = e.currentTarget as HTMLInputElement
    const message = $input.value

    $messages.appendChild(createMessage(message))

    $input.value = ''
  })
}

window.addEventListener('load', initChat)
