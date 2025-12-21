
/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
Cypress.Commands.add('addIngredientByName', (ingredientName: string) => {
  cy.get('[data-testid="ingredient-card"]')
    .contains(ingredientName)
    .parents('[data-testid="ingredient-card"]')
    .within(() => {
      cy.contains('button', 'Добавить').click();
    });
});

Cypress.Commands.add('closeModal', () => {
  cy.get('[data-testid="modal-close-btn"]').click();
  cy.get('[data-testid="modal-div"]').should('not.exist');
});

Cypress.Commands.add('closeModalByOverlay', () => {
  cy.get('[data-testid="modal-overlay"]').click({ force: true });
  cy.get('[data-testid="modal-div"]').should('not.exist');
});