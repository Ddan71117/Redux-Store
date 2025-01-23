import { createSlice } from '@reduxjs/toolkit';
import { idbPromise } from '../helpers';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: [],
    cartOpen: false,
  },
  reducers: {
    ADD_TO_CART: (state, action) => {
      state.cart.push(action.payload);
      idbPromise('cart', 'put', action.payload);
    },
    REMOVE_FROM_CART: (state, action) => {
      state.cart = state.cart.filter(item => item._id !== action.payload._id);
      idbPromise('cart', 'delete', action.payload);
    },
    UPDATE_CART_QUANTITY: (state, action) => {
      const item = state.cart.find(item => item._id === action.payload._id);
      if (item) {
        item.purchaseQuantity = action.payload.purchaseQuantity;
        idbPromise('cart', 'put', item);
      }
    },
    TOGGLE_CART: (state) => {
      state.cartOpen = !state.cartOpen;
    },
    ADD_MULTIPLE_TO_CART: (state, action) => {
      state.cart = [...state.cart, ...action.payload];
    },
    CLEAR_CART: (state) => {
      state.cart = [];
      idbPromise('cart', 'clear');
    },
  },
});

export const { 
  ADD_TO_CART, 
  REMOVE_FROM_CART, 
  UPDATE_CART_QUANTITY, 
  TOGGLE_CART, 
  ADD_MULTIPLE_TO_CART, 
  CLEAR_CART 
} = cartSlice.actions;
export default cartSlice.reducer;
