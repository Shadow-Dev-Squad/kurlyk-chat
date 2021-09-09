import { WebSocket } from 'mock-socket'
import { createServer } from '../support/server'
const appWs = 'ws://localhost:9000'

describe('Chat visibility', function () {
  let server = null

  before(() => {
    cy.visit('/', {
      onBeforeLoad(win: Cypress.AUTWindow) {
        cy.stub(win, 'WebSocket', (url) => {
          createServer(url, (connection) => {
            if (url === appWs) {
              server = connection
            }
          })

          return new WebSocket(url)
        })
      },
    })
  })

  it('Chat base test', function () {
    const recipientName = 'biba'
    const messageFromNigga = {
      type: 'message',
      payload: {
        id: 'string',
        date: new Date(),
        text: 'Hello biba, howdy?',
        from: 'nigga',
        to: recipientName,
      },
    }
    const messageFromBiba = 'Hello Nigga, whasap? huh'

    cy.get('[data-cy=nickname-input]').type(recipientName)
    cy.get('[data-cy=chat]').should('be.visible')
    cy.get('[data-cy=chat__hello-button]').click()

    cy.log('wait for connect second websocket and send messages')
    setTimeout(() => {
      server.send(
        JSON.stringify({
          type: 'users',
          payload: {
            users: [recipientName, 'nigga'],
          },
        })
      )

      server.send(JSON.stringify(messageFromNigga))
      server.on('message', (msg) => {
        const message = JSON.parse(msg)

        expect(message.payload.text).to.be.eq(messageFromBiba)
        expect(message.from).to.be.eq(recipientName)
        expect(message.to).to.be.eq('nigga')
      })
    }, 400)

    cy.log('Check received message from nigga')
      .get('[data-cy=chat-message]')
      .first()
      .shadow()
      .find('.message')
      .should('be.visible')
      .find('.text')
      .should('contain.text', messageFromNigga.payload.text)

    cy.get('[data-cy=chat-input]').type(messageFromBiba).type('{enter}')

    cy.log('Check visibility message to nigga')
      .get('[data-cy=chat-message]')
      .filter(':eq(1)')
      .shadow()
      .find('.message')
      .should('be.visible')
      .find('.text')
      .should('contain.text', messageFromBiba)
  })
})
