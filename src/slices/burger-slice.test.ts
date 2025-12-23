import { constructorReducer, initialState } from './burger-slice';
import { TIngredient } from '@utils-types';

// Моковые данные для тестов
const mockBun: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
};

const mockIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0940',
  name: 'Говяжий метеорит (отбивная)',
  type: 'main',
  proteins: 800,
  fat: 800,
  carbohydrates: 300,
  calories: 2674,
  price: 3000,
  image: 'https://code.s3.yandex.net/react/code/meat-04.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png',
};

const mockSauce: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
};

describe('Редьюсер конструктора бургера', () => {
  describe('Начальное состояние', () => {
    it('должен возвращать начальное состояние', () => {
      const result = constructorReducer(undefined, { type: '' });
      expect(result).toEqual(initialState);
    });
  });

  describe('Экшен добавления ингредиента (addIngredient)', () => {
    it('должен добавлять булку в бургер', () => {
      const action = {
        type: 'myconstructor/addIngredient',
        payload: {
          ...mockBun,
          id: expect.any(String) // nanoid генерирует уникальный id
        }
      };

      const result = constructorReducer(initialState, action);
      expect(result.burger.bun).toEqual(action.payload);
      expect(result.burger.ingredients).toEqual([]);
      expect(result.burger.bun?._id).toBeDefined();
    });

    it('должен добавлять начинку в бургер', () => {
      const action = {
        type: 'myconstructor/addIngredient',
        payload: {
          ...mockIngredient,
          id: expect.any(String)
        }
      };

      const result = constructorReducer(initialState, action);

      expect(result.burger.bun).toBeNull();
      expect(result.burger.ingredients).toHaveLength(1);
      expect(result.burger.ingredients[0]).toEqual(action.payload);
      expect(result.burger.ingredients[0].id).toBeDefined();
    });

    it('должен заменять булку при добавлении новой булки', () => {
      const firstAction = {
        type: 'myconstructor/addIngredient',
        payload: {
          ...mockBun,
          id: 'first_bun_id'
        }
      };

      const stateWithBun = constructorReducer(initialState, firstAction);

      const secondBun: TIngredient = {
        ...mockBun,
        _id: 'new_bun_id',
        name: 'Новая космическая булка',
        price: 1500
      };

      const secondAction = {
        type: 'myconstructor/addIngredient',
        payload: {
          ...secondBun,
          id: 'second_bun_id'
        }
      };

      const result = constructorReducer(stateWithBun, secondAction);

      expect(result.burger.bun).toEqual(secondAction.payload);
      expect(result.burger.bun?._id).toBe('new_bun_id');
      expect(result.burger.bun?.name).toBe('Новая космическая булка');
    });

    it('должен добавлять несколько ингредиентов в бургер', () => {
      let state = initialState;

      // Добавляем булку
      const bunAction = {
        type: 'myconstructor/addIngredient',
        payload: { ...mockBun, id: 'bun_id_1' }
      };
      state = constructorReducer(state, bunAction);

      // Добавляем первый ингредиент
      const firstIngredientAction = {
        type: 'myconstructor/addIngredient',
        payload: { ...mockIngredient, id: 'ingredient_id_1' }
      };
      state = constructorReducer(state, firstIngredientAction);

      // Добавляем второй ингредиент
      const secondIngredientAction = {
        type: 'myconstructor/addIngredient',
        payload: { ...mockSauce, id: 'sauce_id_1' }
      };
      state = constructorReducer(state, secondIngredientAction);

      expect(state.burger.bun).toEqual(bunAction.payload);
      expect(state.burger.ingredients).toHaveLength(2);
      expect(state.burger.ingredients[0]).toEqual(firstIngredientAction.payload);
      expect(state.burger.ingredients[1]).toEqual(secondIngredientAction.payload);
    });
  });

  describe('Экшен удаления ингредиента (removeIngredient)', () => {
    it('должен удалять ингредиент по id', () => {
      // Создаем состояние с несколькими ингредиентами
      const stateWithIngredients = {
        ...initialState,
        burger: {
          bun: null,
          ingredients: [
            { ...mockIngredient, id: 'id_1' },
            { ...mockSauce, id: 'id_2' },
            { ...mockIngredient, id: 'id_3' }
          ]
        }
      };

      const action = {
        type: 'myconstructor/removeIngredient',
        payload: 'id_2'
      };

      const result = constructorReducer(stateWithIngredients, action);

      expect(result.burger.ingredients).toHaveLength(2);
      expect(result.burger.ingredients[0].id).toBe('id_1');
      expect(result.burger.ingredients[1].id).toBe('id_3');
      expect(result.burger.ingredients).not.toContainEqual(
        expect.objectContaining({ id: 'id_2' })
      );
    });

    it('не должен ничего удалять если id не найден', () => {
      const stateWithIngredients = {
        ...initialState,
        burger: {
          bun: null,
          ingredients: [
            { ...mockIngredient, id: 'id_1' },
            { ...mockSauce, id: 'id_2' }
          ]
        }
      };

      const action = {
        type: 'myconstructor/removeIngredient',
        payload: 'non_existent_id'
      };

      const result = constructorReducer(stateWithIngredients, action);

      expect(result.burger.ingredients).toHaveLength(2);
      expect(result.burger.ingredients).toEqual(stateWithIngredients.burger.ingredients);
    });

    it('должен корректно обрабатывать пустой массив ингредиентов', () => {
      const action = {
        type: 'myconstructor/removeIngredient',
        payload: 'some_id'
      };

      const result = constructorReducer(initialState, action);

      expect(result.burger.ingredients).toEqual([]);
    });
  });

  describe('Экшен изменения порядка ингредиентов (swapIngredient)', () => {
    it('должен менять местами ингредиенты по указанным индексам', () => {
      const stateWithIngredients = {
        ...initialState,
        burger: {
          bun: null,
          ingredients: [
            { ...mockIngredient, id: 'id_1', name: 'Первый' },
            { ...mockSauce, id: 'id_2', name: 'Второй' },
            { ...mockIngredient, id: 'id_3', name: 'Третий' }
          ]
        }
      };

      const action = {
        type: 'myconstructor/swapIngredient',
        payload: {
          first: 0,
          second: 2
        }
      };

      const result = constructorReducer(stateWithIngredients, action);

      // Проверяем, что элементы поменялись местами
      expect(result.burger.ingredients[0].id).toBe('id_3');
      expect(result.burger.ingredients[0].name).toBe('Третий');
      expect(result.burger.ingredients[1].id).toBe('id_2');
      expect(result.burger.ingredients[1].name).toBe('Второй');
      expect(result.burger.ingredients[2].id).toBe('id_1');
      expect(result.burger.ingredients[2].name).toBe('Первый');
    });

    it('должен менять местами соседние ингредиенты', () => {
      const stateWithIngredients = {
        ...initialState,
        burger: {
          bun: null,
          ingredients: [
            { ...mockIngredient, id: 'id_1', name: 'Первый' },
            { ...mockSauce, id: 'id_2', name: 'Второй' },
            { ...mockIngredient, id: 'id_3', name: 'Третий' }
          ]
        }
      };

      const action = {
        type: 'myconstructor/swapIngredient',
        payload: {
          first: 0,
          second: 1
        }
      };

      const result = constructorReducer(stateWithIngredients, action);

      expect(result.burger.ingredients[0].id).toBe('id_2');
      expect(result.burger.ingredients[0].name).toBe('Второй');
      expect(result.burger.ingredients[1].id).toBe('id_1');
      expect(result.burger.ingredients[1].name).toBe('Первый');
      expect(result.burger.ingredients[2].id).toBe('id_3');
      expect(result.burger.ingredients[2].name).toBe('Третий');
    });

    it('не должен изменять состояние при замене одинаковых индексов', () => {
      const stateWithIngredients = {
        ...initialState,
        burger: {
          bun: null,
          ingredients: [
            { ...mockIngredient, id: 'id_1' },
            { ...mockSauce, id: 'id_2' }
          ]
        }
      };

      const action = {
        type: 'myconstructor/swapIngredient',
        payload: {
          first: 0,
          second: 0
        }
      };

      const result = constructorReducer(stateWithIngredients, action);

      expect(result.burger.ingredients).toEqual(stateWithIngredients.burger.ingredients);
    });

    it('должен корректно обрабатывать пустой массив ингредиентов', () => {
      const action = {
        type: 'myconstructor/swapIngredient',
        payload: {
          first: 0,
          second: 1
        }
      };

      const result = constructorReducer(initialState, action);

      expect(result.burger.ingredients).toEqual([]);
    });

    it('должен корректно обрабатывать массив с одним ингредиентом', () => {
      const stateWithSingleIngredient = {
        ...initialState,
        burger: {
          bun: null,
          ingredients: [{ ...mockIngredient, id: 'id_1' }]
        }
      };

      const action = {
        type: 'myconstructor/swapIngredient',
        payload: {
          first: 0,
          second: 0
        }
      };

      const result = constructorReducer(stateWithSingleIngredient, action);

      expect(result.burger.ingredients).toEqual(stateWithSingleIngredient.burger.ingredients);
    });
  });

  describe('Экшен очистки бургера (clearBurger)', () => {
    it('должен полностью очищать бургер', () => {
      const stateWithBurger = {
        ...initialState,
        burger: {
          bun: { ...mockBun, id: 'bun_id' },
          ingredients: [
            { ...mockIngredient, id: 'id_1' },
            { ...mockSauce, id: 'id_2' }
          ]
        }
      };

      const action = {
        type: 'myconstructor/clearBurger'
      };

      const result = constructorReducer(stateWithBurger, action);

      expect(result.burger.bun).toBeNull();
      expect(result.burger.ingredients).toEqual([]);
    });

    it('должен корректно обрабатывать уже пустой бургер', () => {
      const action = {
        type: 'myconstructor/clearBurger'
      };

      const result = constructorReducer(initialState, action);

      expect(result.burger.bun).toBeNull();
      expect(result.burger.ingredients).toEqual([]);
    });
  });
});