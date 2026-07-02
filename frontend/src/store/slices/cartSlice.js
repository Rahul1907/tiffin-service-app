import { createSlice } from '@reduxjs/toolkit';

const cartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];

const initialState = {
  items: cartItems, // Array of { menuItem: Object, quantity: Number }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { item, quantity = 1 } = action.payload;
      const existingItem = state.items.find(i => i.menuItem._id === item._id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ menuItem: item, quantity });
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(i => i.menuItem._id !== itemId);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const existingItem = state.items.find(i => i.menuItem._id === itemId);
      if (existingItem) {
        existingItem.quantity = Math.max(1, quantity);
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cartItems');
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
