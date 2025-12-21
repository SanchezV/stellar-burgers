describe('Тестирование добавления ингредиента, работы модального окна, создания заказа', () => {
    beforeEach(() => {
    // Настройка моковых данных для ингредиентов
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
    });
    /////////////////////////////
    it('Тестирование добавления ингредиента в конструктор', () => {
        // Название ингредиента, по которому ищем
        const ingredientName = 'Биокотлета из марсианской Магнолии';

        cy.addIngredientByName(ingredientName);

        cy.get('[data-testid="constructor-ingredients-list"]').get('.constructor-element__text')
        .contains(ingredientName)
    });
    /////////////////
    it('Тестирование работы модального окона', () => {
        const ingredientName = 'Краторная булка N-200i';

        cy.get('[data-testid="ingredient-card"]')
            .contains('[data-testid="ingredient-name"]', ingredientName)
            .click();

        // Проверить, что модальное окно появилось
        cy.get('[data-testid="modal-div"]').should('be.visible');

        // нажимаем на иконку закрытия
        cy.closeModal();

        //открываем второй раз перед закрытием по оверлею
        cy.get('[data-testid="ingredient-card"]')
            .contains('[data-testid="ingredient-name"]', ingredientName)
            .click();

        cy.closeModalByOverlay();
    });
    /////////////

    it('Тестирование создания заказа', () => {
        // Загружаем данные пользователя и токен
        cy.fixture('login.json').then((loginData) => {
            // Устанавливаем куки с токеном
            cy.setCookie('accessToken', loginData.accessToken);
            cy.setCookie('refreshToken', loginData.refreshToken);
        });

        // Моки для данных пользователя и заказа
        cy.fixture('user.json').then((userData) => {
            cy.intercept('GET', '/api/auth/user', { statusCode: 200, body: userData });
        });
        cy.fixture('order.json').then((orderResp) => {
            cy.intercept('POST', '/api/orders', { statusCode: 200, body: orderResp });
        });

        // Открываем страницу
        cy.visit('/');
        cy.screenshot('вид_перед_созданием_заказа');
        // Собираем бургер — добавляем ингредиенты
        cy.addIngredientByName('Флюоресцентная булка R2-D3');
        cy.addIngredientByName('Биокотлета из марсианской Магнолии');
        cy.addIngredientByName('Филе Люминесцентного тетраодонтимформа');
        cy.addIngredientByName('Говяжий метеорит (отбивная)');
        cy.screenshot('вид_после_добавления_ингредиентов_в_заказ');
        // Оформляем заказ
        cy.get('[data-testid="make-order"]')
            .click();

        // Проверяем отображение модалки с номером заказа
        cy.get('[data-testid="modal-div"]')
            .should('be.visible')
            .within(() => {
            cy.contains(`идентификатор заказа`);
            // Проверка номера заказа (зависит от fixture)
            cy.get('[data-testid="order-number"]').should('have.text', '96970');
            });
        cy.screenshot('заказ_оформлен');
        // Закрываем модалку
        cy.get('[data-testid="modal-close-btn"]').click();

        // Проверяем, что модалка исчезла
        cy.get('[data-testid="modal-div"]').should('not.exist');

        // Проверяем, что конструктор сброшен
        cy.get('[data-testid="constructor-ingredients-list"]').should('not.have.descendants');
    });
});