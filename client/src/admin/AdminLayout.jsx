import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Tag, Image, Users, Settings, LogOut, Menu, X, ChevronRight, ChevronLeft
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import logo from '../assets/English.png';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
  { to: '/admin/banners', label: 'Banners', icon: Image },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const sidebarW = collapsed ? 'w-16' : 'w-64';
  const mainML = collapsed ? 'lg:ml-16' : 'lg:ml-64';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full ${sidebarW} bg-primary z-50 flex flex-col transition-all duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className={`p-4 border-b border-cream/10 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div className="flex items-center gap-3">
              <img src={logo} alt="Annakshetram" className="h-10 w-auto object-contain" />
              <div>
                <p className="font-heading font-bold text-cream text-base">Annakshetram</p>
                <p className="text-accent text-xs">Admin Panel</p>
              </div>
            </div>
          )}
          {collapsed && (
            <img src={logo} alt="Annakshetram" className="h-9 w-auto object-contain" />
          )}
          {/* Collapse toggle — desktop only */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-full bg-cream/10 hover:bg-cream/20 text-cream transition-colors flex-shrink-0"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-2 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${collapsed ? 'justify-center' : ''} ${
                  isActive
                    ? 'bg-accent text-primary-dark shadow-gold'
                    : 'text-cream/70 hover:text-cream hover:bg-cream/10'
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && label}
            </NavLink>
          ))}
        </nav>

        {/* User & Logout */}
        <div className="p-3 border-t border-cream/10">
          {!collapsed && (
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-8 h-8 bg-accent/30 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-cream font-bold text-sm">{user?.name?.[0]?.toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-cream text-sm font-medium truncate">{user?.name}</p>
                <p className="text-cream/50 text-xs">{user?.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            title={collapsed ? 'Logout' : undefined}
            className={`flex items-center gap-2 text-cream/60 hover:text-red-300 transition-colors text-sm px-2 py-2 w-full rounded-lg hover:bg-red-500/10 ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && 'Logout'}
          </button>
          <Link
            to="/"
            title={collapsed ? 'View Site' : undefined}
            className={`flex items-center gap-2 text-cream/60 hover:text-accent text-sm px-2 py-2 mt-1 rounded-lg hover:bg-cream/10 transition-colors ${collapsed ? 'justify-center' : ''}`}
          >
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            {!collapsed && 'View Site'}
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className={`flex-1 ${mainML} flex flex-col min-h-screen transition-all duration-300`}>
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="hidden lg:flex items-center gap-2 text-gray-500 text-sm">
            Admin Dashboard
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 hidden sm:block">Welcome, {user?.name?.split(' ')[0]}</span>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
