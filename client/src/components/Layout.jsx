import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import useCartStore from '../store/useCartStore';
import useSettingsStore from '../store/useSettingsStore';
import useAuthStore from '../store/useAuthStore';

export default function Layout() {
  const { fetchCart } = useCartStore();
  const { fetchSettings } = useSettingsStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchSettings();
    if (isAuthenticated()) fetchCart();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
