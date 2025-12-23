import { ordersReducer } from './orders-slice';

// Определяем initialState вручную
const initialState = {
  feed: {
    success: false,
    total: 0,
    totalToday: 0,
    orders: []
  },
  userOrders: [],
  orderByNumber: null,
  newOrder: {
    order: null,
    name: ''
  },
  orderRequest: false,
  loading: false,
  error: null
};

// Моковые данные
const mockOrder = {
  _id: 'order_id_1',
  ingredients: ['643d69a5c3f7b9001cfa0940', '643d69a5c3f7b9001cfa093d'],
  status: 'done',
  name: 'Био-марсианский метеоритный флюоресцентный люминесцентный бургер',
  createdAt: '2025-12-11T18:10:01.073Z',
  updatedAt: '2025-12-11T18:10:01.274Z',
  number: 12345
};

const mockFeedResponse = {
  success: true,
  orders: [mockOrder],
  total: 100,
  totalToday: 10
};

const mockUserOrdersResponse = [mockOrder];

const mockOrderByNumberResponse = {
  success: true,
  orders: [mockOrder]
};

const mockNewOrderResponse = {
  success: true,
  name: 'Ваш заказ готовится',
  order: mockOrder
};

describe('Редьюсер заказов', () => {
  it('должен возвращать начальное состояние', () => {
    const result = ordersReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  describe('getFeedsThunk', () => {
    it('должен обрабатывать pending состояние', () => {
      const action = { type: 'feed/fetchInfo/pending' };
      const state = ordersReducer(initialState, action);
      
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('должен обрабатывать fulfilled состояние', () => {
      const pendingState = { ...initialState, loading: true };
      const action = {
        type: 'feed/fetchInfo/fulfilled',
        payload: mockFeedResponse
      };
      const state = ordersReducer(pendingState, action);
      
      expect(state.loading).toBe(false);
      expect(state.feed).toEqual(mockFeedResponse);
    });

    it('должен обрабатывать rejected состояние', () => {
      const pendingState = { ...initialState, loading: true };
      const action = {
        type: 'feed/fetchInfo/rejected',
        payload: 'Ошибка загрузки'
      };
      const state = ordersReducer(pendingState, action);
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки');
    });
  });

  describe('getOrderByNumberThunk', () => {
    it('должен обрабатывать pending состояние', () => {
      const action = { type: 'feed/fetchByNumber/pending' };
      const state = ordersReducer(initialState, action);
      
      expect(state.loading).toBe(true);
      expect(state.orderByNumber).toBe(null);
    });

    it('должен обрабатывать fulfilled состояние', () => {
      const pendingState = { ...initialState, loading: true };
      const action = {
        type: 'feed/fetchByNumber/fulfilled',
        payload: mockOrderByNumberResponse
      };
      const state = ordersReducer(pendingState, action);
      
      expect(state.loading).toBe(false);
      expect(state.orderByNumber).toEqual(mockOrder);
    });

    it('должен обрабатывать rejected состояние', () => {
      const pendingState = { ...initialState, loading: true };
      const action = {
        type: 'feed/fetchByNumber/rejected',
        payload: 'Заказ не найден'
      };
      const state = ordersReducer(pendingState, action);
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Заказ не найден');
    });
  });

  describe('postUserBurderThunk', () => {
    it('должен обрабатывать pending состояние', () => {
      const action = { type: 'order/postUserBurger/pending' };
      const state = ordersReducer(initialState, action);
      
      expect(state.loading).toBe(true);
      expect(state.orderRequest).toBe(true);
    });

    it('должен обрабатывать fulfilled состояние', () => {
      const pendingState = { 
        ...initialState, 
        loading: true, 
        orderRequest: true 
      };
      const action = {
        type: 'order/postUserBurger/fulfilled',
        payload: mockNewOrderResponse
      };
      const state = ordersReducer(pendingState, action);
      
      expect(state.loading).toBe(false);
      expect(state.orderRequest).toBe(false);
      expect(state.newOrder.order).toEqual(mockOrder);
      expect(state.newOrder.name).toBe('Ваш заказ готовится');
    });

    it('должен обрабатывать rejected состояние', () => {
      const pendingState = { 
        ...initialState, 
        loading: true, 
        orderRequest: true 
      };
      const action = {
        type: 'order/postUserBurger/rejected',
        payload: 'Ошибка отправки'
      };
      const state = ordersReducer(pendingState, action);
      
      expect(state.loading).toBe(false);
      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe('Ошибка отправки');
    });
  });

  describe('getUserOrdersThunk', () => {
    it('должен обрабатывать pending состояние', () => {
      const action = { type: 'order/getUserOrders/pending' };
      const state = ordersReducer(initialState, action);
      
      expect(state.loading).toBe(true);
    });

    it('должен обрабатывать fulfilled состояние', () => {
      const pendingState = { ...initialState, loading: true };
      const action = {
        type: 'order/getUserOrders/fulfilled',
        payload: mockUserOrdersResponse
      };
      const state = ordersReducer(pendingState, action);
      
      expect(state.loading).toBe(false);
      expect(state.userOrders).toEqual(mockUserOrdersResponse);
    });

    it('должен обрабатывать rejected состояние', () => {
      const pendingState = { ...initialState, loading: true };
      const action = {
        type: 'order/getUserOrders/rejected',
        payload: 'Ошибка загрузки'
      };
      const state = ordersReducer(pendingState, action);
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки');
    });
  });

  describe('Синхронный экшен setNewOrder', () => {
    it('должен устанавливать orderRequest и очищать newOrder', () => {
      const action = {
        type: 'orders/setNewOrder',
        payload: true
      };
      const state = ordersReducer(initialState, action);
      
      expect(state.orderRequest).toBe(true);
      expect(state.newOrder.order).toBe(null);
    });
  });

  it('не должен изменять состояние при неизвестном экшене', () => {
    const currentState = { ...initialState, loading: true };
    const action = { type: 'UNKNOWN_ACTION' };
    const result = ordersReducer(currentState, action);
    
    expect(result).toEqual(currentState);
  });
});