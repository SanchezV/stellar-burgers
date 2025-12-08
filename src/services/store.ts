import { configureStore, combineReducers } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import burgerReducer from '../slices/burger-slice';
import ingredientsReducer from '../slices/ingredients-slice';
import ordersReducer from '../slices/orders-slice';
import authReducer from '../slices/auth-slice';

// Объединение редьюсеров
const rootReducer = combineReducers({
  burger: burgerReducer,
  orders: ordersReducer,
  ingredients: ingredientsReducer,
  auth: authReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

// Типизация RootState
export type RootState = ReturnType<typeof rootReducer>;

// Типизация Dispatch
export type AppDispatch = typeof store.dispatch;

// Хуки с правильной типизацией
export const useDispatch = () => dispatchHook<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
