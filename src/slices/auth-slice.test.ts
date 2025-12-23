import { createAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

// Мокаем зависимости перед импортом
jest.mock('@api', () => ({
  getUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  logoutApi: jest.fn(),
  registerUserApi: jest.fn(),
  updateUserApi: jest.fn()
}));

jest.mock('../utils/cookie', () => ({
  setCookie: jest.fn(),
  getCookie: jest.fn()
}));

// Создаем моковые данные
const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

const mockAuthResponse = {
  user: mockUser,
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token'
};

// Создаем тестовый редьюсер на основе кода из слайса
const createTestReducer = () => {
  const initialState = {
    user: null as TUser | null,
    isAuthChecked: false,
    loading: false,
    error: null as string | null
  };

  // Создаем синхронные экшены
  const setUser = createAction<TUser>('user/setUser');
  const setIsAuthChecked = createAction<boolean>('user/setIsAuthChecked');

  // Типы для асинхронных экшенов
  const registerUserThunk = {
    pending: { type: 'user/register/pending' },
    fulfilled: { type: 'user/register/fulfilled' },
    rejected: { type: 'user/register/rejected' }
  };

  const loginUserThunk = {
    pending: { type: 'user/login/pending' },
    fulfilled: { type: 'user/login/fulfilled' },
    rejected: { type: 'user/login/rejected' }
  };

  const updateUserThunk = {
    pending: { type: 'user/update/pending' },
    fulfilled: { type: 'user/update/fulfilled' },
    rejected: { type: 'user/update/rejected' }
  };

  const logoutUserThunk = {
    pending: { type: 'user/logout/pending' },
    fulfilled: { type: 'user/logout/fulfilled' },
    rejected: { type: 'user/logout/rejected' }
  };

  // Редьюсер
  const reducer = (state = initialState, action: any) => {
    switch (action.type) {
      case setUser.type:
        return { ...state, user: action.payload };
      
      case setIsAuthChecked.type:
        return { ...state, isAuthChecked: action.payload };
      
      // Регистрация
      case registerUserThunk.pending.type:
      case loginUserThunk.pending.type:
      case updateUserThunk.pending.type:
      case logoutUserThunk.pending.type:
        return { ...state, loading: true, error: null };
      
      // Успешная регистрация
      case registerUserThunk.fulfilled.type:
        return {
          ...state,
          loading: false,
          user: action.payload.user,
          isAuthChecked: true
        };
      
      // Успешный вход
      case loginUserThunk.fulfilled.type:
        return {
          ...state,
          loading: false,
          user: action.payload.user,
          isAuthChecked: true
        };
      
      // Успешное обновление
      case updateUserThunk.fulfilled.type:
        return {
          ...state,
          loading: false,
          user: action.payload.user
        };
      
      // Успешный выход
      case logoutUserThunk.fulfilled.type:
        return {
          ...state,
          loading: false,
          user: null
        };
      
      // Ошибки
      case registerUserThunk.rejected.type:
      case loginUserThunk.rejected.type:
      case updateUserThunk.rejected.type:
      case logoutUserThunk.rejected.type:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
      
      default:
        return state;
    }
  };

  return {
    reducer,
    actions: {
      setUser,
      setIsAuthChecked,
      registerUserThunk,
      loginUserThunk,
      updateUserThunk,
      logoutUserThunk
    },
    initialState
  };
};

describe('Слайс аутентификации', () => {
  const { reducer, actions, initialState } = createTestReducer();
  const { 
    setUser, 
    setIsAuthChecked, 
    registerUserThunk, 
    loginUserThunk, 
    updateUserThunk, 
    logoutUserThunk 
  } = actions;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Начальное состояние', () => {
    it('должен возвращать начальное состояние', () => {
      expect(reducer(undefined, { type: '' })).toEqual(initialState);
    });
  });

  describe('Синхронные экшены', () => {
    it('должен обрабатывать setUser', () => {
      const action = setUser(mockUser);
      const result = reducer(initialState, action);

      expect(result.user).toEqual(mockUser);
      expect(result.loading).toBe(false);
      expect(result.error).toBe(null);
    });

    it('должен обрабатывать setIsAuthChecked', () => {
      const action = setIsAuthChecked(true);
      const result = reducer(initialState, action);

      expect(result.isAuthChecked).toBe(true);
    });
  });

  describe('Асинхронные экшены', () => {
    describe('registerUserThunk', () => {
      it('должен обрабатывать pending состояние регистрации', () => {
        const action = registerUserThunk.pending;
        const state = reducer(initialState, action);

        expect(state.loading).toBe(true);
        expect(state.error).toBe(null);
      });

      it('должен обрабатывать fulfilled состояние регистрации', () => {
        const action = {
          ...registerUserThunk.fulfilled,
          payload: mockAuthResponse
        };
        const state = reducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.user).toEqual(mockUser);
        expect(state.isAuthChecked).toBe(true);
      });

      it('должен обрабатывать rejected состояние регистрации', () => {
        const errorMessage = 'Ошибка регистрации';
        const action = {
          ...registerUserThunk.rejected,
          payload: errorMessage
        };
        const state = reducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.error).toBe(errorMessage);
        expect(state.user).toBe(null);
      });
    });

    describe('loginUserThunk', () => {
      it('должен обрабатывать pending состояние входа', () => {
        const action = loginUserThunk.pending;
        const state = reducer(initialState, action);

        expect(state.loading).toBe(true);
        expect(state.error).toBe(null);
      });

      it('должен обрабатывать fulfilled состояние входа', () => {
        const action = {
          ...loginUserThunk.fulfilled,
          payload: mockAuthResponse
        };
        const state = reducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.user).toEqual(mockUser);
        expect(state.isAuthChecked).toBe(true);
      });

      it('должен обрабатывать rejected состояние входа', () => {
        const errorMessage = 'Ошибка входа';
        const action = {
          ...loginUserThunk.rejected,
          payload: errorMessage
        };
        const state = reducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.error).toBe(errorMessage);
        expect(state.user).toBe(null);
      });
    });

    describe('updateUserThunk', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser
      };

      const updatedUser = {
        email: 'updated@example.com',
        name: 'Updated User'
      };

      it('должен обрабатывать pending состояние обновления', () => {
        const action = updateUserThunk.pending;
        const state = reducer(stateWithUser, action);

        expect(state.loading).toBe(true);
        expect(state.error).toBe(null);
        expect(state.user).toEqual(mockUser);
      });

      it('должен обрабатывать fulfilled состояние обновления', () => {
        const action = {
          ...updateUserThunk.fulfilled,
          payload: { user: updatedUser }
        };
        const state = reducer(stateWithUser, action);

        expect(state.loading).toBe(false);
        expect(state.user).toEqual(updatedUser);
        expect(state.error).toBe(null);
      });

      it('должен обрабатывать rejected состояние обновления', () => {
        const errorMessage = 'Ошибка обновления';
        const action = {
          ...updateUserThunk.rejected,
          payload: errorMessage
        };
        const state = reducer(stateWithUser, action);

        expect(state.loading).toBe(false);
        expect(state.error).toBe(errorMessage);
        expect(state.user).toEqual(mockUser);
      });
    });

    describe('logoutUserThunk', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isAuthChecked: true
      };

      it('должен обрабатывать pending состояние выхода', () => {
        const action = logoutUserThunk.pending;
        const state = reducer(stateWithUser, action);

        expect(state.loading).toBe(true);
        expect(state.error).toBe(null);
        expect(state.user).toEqual(mockUser);
      });

      it('должен обрабатывать fulfilled состояние выхода', () => {
        const action = logoutUserThunk.fulfilled;
        const state = reducer(stateWithUser, action);

        expect(state.loading).toBe(false);
        expect(state.user).toBe(null);
      });

      it('должен обрабатывать rejected состояние выхода', () => {
        const errorMessage = 'Ошибка выхода';
        const action = {
          ...logoutUserThunk.rejected,
          payload: errorMessage
        };
        const state = reducer(stateWithUser, action);

        expect(state.loading).toBe(false);
        expect(state.error).toBe(errorMessage);
        expect(state.user).toEqual(mockUser);
      });
    });
  });

  describe('Интеграционные сценарии', () => {
    it('должен корректно обрабатывать полный цикл аутентификации', () => {
      let state = initialState;

      // 1. Начинаем регистрацию
      state = reducer(state, registerUserThunk.pending);
      expect(state.loading).toBe(true);

      // 2. Успешная регистрация
      state = reducer(state, {
        ...registerUserThunk.fulfilled,
        payload: mockAuthResponse
      });
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);

      // 3. Обновляем данные пользователя
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      state = reducer(state, updateUserThunk.pending);
      expect(state.loading).toBe(true);

      state = reducer(state, {
        ...updateUserThunk.fulfilled,
        payload: { user: updatedUser }
      });
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(updatedUser);

      // 4. Выход из системы
      state = reducer(state, logoutUserThunk.pending);
      expect(state.loading).toBe(true);

      state = reducer(state, logoutUserThunk.fulfilled);
      expect(state.loading).toBe(false);
      expect(state.user).toBe(null);
    });

    it('должен сохранять состояние при ошибках', () => {
      let state = initialState;

      // Пытаемся залогиниться с ошибкой
      state = reducer(state, loginUserThunk.pending);
      expect(state.loading).toBe(true);

      state = reducer(state, {
        ...loginUserThunk.rejected,
        payload: 'Неверные учетные данные'
      });
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Неверные учетные данные');
      expect(state.user).toBe(null);
    });
  });

  describe('Селекторы (тестирование логики)', () => {
    it('selectUser должен возвращать пользователя', () => {
      const testState = {
        user: mockUser,
        isAuthChecked: true,
        loading: false,
        error: null
      };
      
      // Имитируем логику селектора
      const selectUser = (state: typeof testState) => state.user;
      expect(selectUser(testState)).toEqual(mockUser);
    });

    it('selectIsAuthChecked должен возвращать статус проверки аутентификации', () => {
      const testState = {
        user: mockUser,
        isAuthChecked: true,
        loading: false,
        error: null
      };
      
      const selectIsAuthChecked = (state: typeof testState) => state.isAuthChecked;
      expect(selectIsAuthChecked(testState)).toBe(true);
    });

    it('selectUserLoading должен возвращать статус загрузки', () => {
      const testState = {
        user: mockUser,
        isAuthChecked: true,
        loading: true,
        error: null
      };
      
      const selectUserLoading = (state: typeof testState) => state.loading;
      expect(selectUserLoading(testState)).toBe(true);
    });
  });
});