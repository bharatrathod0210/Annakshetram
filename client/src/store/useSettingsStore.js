import { create } from 'zustand';
import api from '../lib/api';

const useSettingsStore = create((set) => ({
  settings: {
    storeName: 'Annakshetram',
    tagline: 'Satvikam Jeevanam, Shuddham Bhojanam',
    whatsappNumber: '919035735818',
    contactEmail: 'contact@annakshetram.com',
    contactPhone: '+91 9035735818',
    address: 'Karnataka, India',
    facebookUrl: '',
    instagramUrl: '',
  },

  fetchSettings: async () => {
    try {
      const res = await api.get('/admin/settings');
      set({ settings: res.data.data.settings });
    } catch {}
  },
}));

export default useSettingsStore;
