describe('Chat visibility', function () {
  it('Chat base test', function () {
    cy.visit('/')
    cy.get('[data-cy=chat]').should('be.visible')
  })
})
