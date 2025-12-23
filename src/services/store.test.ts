import { burgerSlice } from '../slices/burger-slice';
import { ingredientsSlice } from '../slices/ingredients-slice';
import { rootReducer } from './store';
import { authSlice } from '../slices/auth-slice';
import { ordersSlice } from '../slices/orders-slice';

describe('rootReducer', () => {
  it('should return the initial state', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    // Проверяем, что состояние содержит свойства для каждого среза
    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('myconstructor');
    expect(initialState).toHaveProperty('user');
    expect(initialState).toHaveProperty('orders');

    // Варианты проверок начальных состояний для каждого среза
    expect(initialState.ingredients).toEqual(ingredientsSlice.getInitialState());
    expect(initialState.myconstructor).toEqual(burgerSlice.getInitialState());
    expect(initialState.user).toEqual(authSlice.getInitialState());
    expect(initialState.orders).toEqual(ordersSlice.getInitialState());
  });
});