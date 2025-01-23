import { createSlice } from '@reduxjs/toolkit';
import { idbPromise } from '../helpers';

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    currentCategory: '',
  },
  reducers: {
    UPDATE_CATEGORIES: (state, action) => {
      state.categories = action.payload;
      action.payload.forEach((category) => {
        idbPromise('categories', 'put', category);
      });
    },
    UPDATE_CURRENT_CATEGORY: (state, action) => {
      state.currentCategory = action.payload;
    },
  },
});

export const { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } = categorySlice.actions;
export default categorySlice.reducer;
