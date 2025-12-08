import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

interface ConstructorState {
  bun: TConstructorIngredient | null;
  items: TConstructorIngredient[];
}

const initialState: ConstructorState = {
  bun: null,
  items: []
};

const burgerSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    setBun(state, action: PayloadAction<TConstructorIngredient | null>) {
      state.bun = action.payload;
    },
    addConstructorIngredient: {
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        state.items.push(action.payload);
      },
      prepare(ingredient: TConstructorIngredient) {
        return {
          payload: {
            ...ingredient,
            id: uuidv4()
          }
        };
      }
    },
    removeConstructorIngredient(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    moveConstructorIngredient(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const { fromIndex, toIndex } = action.payload;
      const [movedItem] = state.items.splice(fromIndex, 1);
      state.items.splice(toIndex, 0, movedItem);
    },
    clearConstructor(state) {
      state.bun = null;
      state.items = [];
    }
  }
});

export const {
  setBun,
  addConstructorIngredient,
  removeConstructorIngredient,
  moveConstructorIngredient,
  clearConstructor
} = burgerSlice.actions;

export default burgerSlice.reducer;
