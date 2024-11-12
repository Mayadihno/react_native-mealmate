import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MealItemsParams {
  id: number;
  title: string;
  imageUri: string;
  category?: string;
  quantity: number;
  ingredients?: any;
  instructions?: any;
  extendedIngredients?: any;
}

interface MealItems {
  meal: MealItemsParams[];
}

export interface MealState {
  meal: {
    meal: MealItemsParams[];
    length: number;
  };
}

const mealSlice = createSlice({
  name: "meal",
  initialState: {
    meal: [],
  },
  reducers: {
    addItemToMealPlan: (
      state: MealItems,
      action: PayloadAction<MealItemsParams>
    ) => {
      const itemPresents = state.meal.find(
        (item) => item.id === action.payload.id
      );
      if (!itemPresents) {
        state.meal.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (
      state: MealItems,
      action: PayloadAction<MealItemsParams>
    ) => {
      const removeItem = state.meal.filter(
        (item) => item.id !== action.payload.id
      );
      state.meal = removeItem;
    },
    emptyCart: (state: MealItems) => {
      state.meal = [];
    },
  },
});

export const { emptyCart, removeFromCart, addItemToMealPlan } =
  mealSlice.actions;

export default mealSlice.reducer;
