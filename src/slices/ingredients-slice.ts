import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '../utils/types';
import * as burgerApi from '../utils/burger-api';

// Стейт содержит массив элементов конструктора
interface IngredientsState {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const data = await burgerApi.getIngredientsApi();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка загрузки ингредиентов');
    }
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.ingredients = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        fetchIngredients.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  }
});

export default ingredientsSlice.reducer;
