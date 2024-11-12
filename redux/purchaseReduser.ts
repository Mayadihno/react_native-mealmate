import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PurchaseItemsParams {
  id: number;
  title: string;
  imageUri: string;
  category?: string;
  quantity: number;
}

interface PurchaseItems {
  purchase: PurchaseItemsParams[];
}

export interface PurchaseState {
  purchase: {
    purchase: PurchaseItemsParams[];
    length: number;
  };
}

const purchaseSlice = createSlice({
  name: "purchase",
  initialState: {
    purchase: [],
  },
  reducers: {
    addItemToPurchase: (
      state: PurchaseItems,
      action: PayloadAction<PurchaseItemsParams>
    ) => {
      const itemPresents = state.purchase.find(
        (item) => item.id === action.payload.id
      );
      if (!itemPresents) {
        state.purchase.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromPurchaseCart: (
      state: PurchaseItems,
      action: PayloadAction<PurchaseItemsParams>
    ) => {
      const removeItem = state.purchase.filter(
        (item) => item.id !== action.payload.id
      );
      state.purchase = removeItem;
    },
    emptyPurchaseCart: (state: PurchaseItems) => {
      state.purchase = [];
    },
  },
});

export const { emptyPurchaseCart, removeFromPurchaseCart, addItemToPurchase } =
  purchaseSlice.actions;

export default purchaseSlice.reducer;
