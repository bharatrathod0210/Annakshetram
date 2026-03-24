import { useState, useEffect } from 'react';
import { Package, Users, Tag, LayoutDashboard, TrendingUp, ArrowUp } from 'lucide-react';
import api from '../../lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(res => {
      setStats(res.data.data.stats);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500', trend: '+12%' },
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-green-500', trend: '+5%' },
    { label: 'Categories', value: stats.totalCategories, icon: Tag, color: 'bg-accent', trend: '' },
    { label: 'Featured Products', value: stats.featuredProducts, icon: TrendingUp, color: 'bg-primary', trend: '' },
  ] : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome to Annakshetram Admin Panel</p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
              <div className="h-8 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {statCards.map(({ label, value, icon: Icon, color, trend }) => (
            <div key={label} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 ${color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                {trend && (
                  <span className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                    <ArrowUp className="w-3 h-3" />{trend}
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-gray-900 font-heading">{value}</p>
              <p className="text-gray-500 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 text-lg mb-4 font-heading">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            ['Add Product', '/admin/products', Package, 'bg-primary/10 text-primary'],
            ['Add Category', '/admin/categories', Tag, 'bg-green-50 text-green-700'],
            ['Add Banner', '/admin/banners', LayoutDashboard, 'bg-blue-50 text-blue-700'],
            ['Manage Users', '/admin/users', Users, 'bg-purple-50 text-purple-700'],
          ].map(([label, to, Icon, cls]) => (
            <a key={label} href={to} className={`flex flex-col items-center gap-2 p-4 rounded-lg ${cls} hover:opacity-80 transition-opacity text-center`}>
              <Icon className="w-6 h-6" />
              <span className="text-sm font-medium">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
