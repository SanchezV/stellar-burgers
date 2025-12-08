import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppDispatch } from '../services/store';
import * as burgerApi from '../utils/burger-api';
import { TOrder } from '@utils-types';
import { clearConstructor } from './burger-slice';

interface OrdersState {
  orders: TOrder[];
  userOrders: TOrder[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  userOrders: [],
  orderRequest: false,
  orderModalData: null,
  loading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk(
  'orders/fetchFeeds',
  async (_, { rejectWithValue }) => {
    try {
      const data = await burgerApi.getFeedsApi();
      return data.orders;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка загрузки заказов');
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const data = await burgerApi.getOrdersApi();
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.message || 'Ошибка загрузки заказов пользователя'
      );
    }
  }
);

export const createOrder = createAsyncThunk<
  TOrder,
  void,
  { rejectValue: string; state: RootState; dispatch: AppDispatch }
>('orders/createOrder', async (_, { getState, rejectWithValue, dispatch }) => {
  try {
    const state = getState();
    const constructor = state.burger;

    if (!constructor.bun) {
      return rejectWithValue('Булка не выбрана');
    }

    const ingredientIds: string[] = [
      constructor.bun._id,
      ...constructor.items.map((i) => i._id),
      constructor.bun._id
    ];

    const data = await burgerApi.orderBurgerApi(ingredientIds);
    if (data && data.order) {
      console.log('qweqweqwe');
      dispatch(clearConstructor());
      return data.order;
    }
    return rejectWithValue('Ошибка ответа сервера при создании заказа');
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка создания заказа');
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    closeOrderModal(state) {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFeeds.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.orders = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchFeeds.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.userOrders = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchOrders.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderRequest = false;
          state.orderModalData = action.payload;
          state.orders.push(action.payload);
        }
      )
      .addCase(createOrder.rejected, (state, action: PayloadAction<any>) => {
        state.orderRequest = false;
        state.error = action.payload;
      });
  }
});

export const { closeOrderModal } = ordersSlice.actions;
export default ordersSlice.reducer;
