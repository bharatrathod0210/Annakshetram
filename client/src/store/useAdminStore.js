import { create } from 'zustand';
import api from '../lib/api';

const useAdminStore = create((set, get) => ({
  unseenOrdersCount: 0,
  
  // Fetch unseen orders count
  fetchUnseenCount: async () => {
    try {
      const { data } = await api.get('/admin/orders/unseen/count');
      if (data.success) {
        set({ unseenOrdersCount: data.count });
      }
    } catch (error) {
      console.error('Error fetching unseen count:', error);
    }
  },
  
  // Decrement count when order is marked as seen
  decrementUnseenCount: () => {
    set((state) => ({ 
      unseenOrdersCount: Math.max(0, state.unseenOrdersCount - 1) 
    }));
  },
  
  // Increment count when new order arrives
  incrementUnseenCount: () => {
    set((state) => ({ 
      unseenOrdersCount: state.unseenOrdersCount + 1 
    }));
  },
  
  // Reset count
  resetUnseenCount: () => {
    set({ unseenOrdersCount: 0 });
  },
}));

export default useAdminStore;
