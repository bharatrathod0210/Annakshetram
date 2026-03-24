import { create } from 'zustand';
import api from '../lib/api';
import useAuthStore from './useAuthStore';

const useCartStore = create((set, get) => ({
  items: [],
  isLoading: false,
  isOpen: false,

  setOpen: (open) => set({ isOpen: open }),

  fetchCart: async () => {
    if (!useAuthStore.getState().isAuthenticated()) return;
    set({ isLoading: true });
    try {
      const res = await api.get('/cart');
      set({ items: res.data.data.cart.items, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    if (!useAuthStore.getState().isAuthenticated()) return { success: false, needsLogin: true };
    set({ isLoading: true });
    try {
      const res = await api.post('/cart/add', { productId, quantity });
      set({ items: res.data.data.cart.items, isLoading: false, isOpen: true });
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, message: err.response?.data?.message };
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      const res = await api.put('/cart/update', { productId, quantity });
      set({ items: res.data.data.cart.items });
    } catch {}
  },

  removeItem: async (productId) => {
    try {
      const res = await api.delete(`/cart/remove/${productId}`);
      set({ items: res.data.data.cart.items });
    } catch {}
  },

  clearCart: async () => {
    try {
      await api.delete('/cart/clear');
      set({ items: [] });
    } catch {}
  },

  getTotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  getCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));

export default useCartStore;
