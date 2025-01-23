import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer,
    categories: categoryReducer,
  },
});

export default store;