import { createSlice } from '@reduxjs/toolkit';
import { idbPromise } from '../helpers';

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    currentCategory: '',
  },
  reducers: {
    UPDATE_PRODUCTS: (state, action) => {
      state.products = action.payload;
      action.payload.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    },
    UPDATE_CURRENT_CATEGORY: (state, action) => {
      state.currentCategory = action.payload;
    },
  },
});

export const { UPDATE_PRODUCTS, UPDATE_CURRENT_CATEGORY } = productSlice.actions;
export default productSlice.reducer;
