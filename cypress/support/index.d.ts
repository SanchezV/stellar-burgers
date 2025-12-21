
declare namespace Cypress {
  interface Chainable {
    /**
     * Закрывает модальное окно, нажимая кнопку закрытия
     */
    closeModal(): Chainable<void>;

    /**
     * Закрывает модальное окно, кликами на оверлей
     */
    closeModalByOverlay(): Chainable<void>;

    /**
     * Ваша другая кастомная команда, например, addIngredientByName
     */
    addIngredientByName(ingredientName: string): Chainable<void>;
  }
}