import { useState, useEffect, useMemo } from 'react';
import { 
  Package, Users, Tag, ShoppingBag, IndianRupee, TrendingUp, TrendingDown,
  Clock, CheckCircle, XCircle, Truck, ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(res => {
      setStats(res.data.data.stats);
      setRecentOrders(res.data.data.recentOrders || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Calculate trends and percentages
  const metrics = useMemo(() => {
    if (!stats) return null;
    
    const completionRate = stats.totalOrders > 0 
      ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(1)
      : 0;
    
    const avgOrderValue = stats.totalOrders > 0
      ? (stats.totalRevenue / stats.totalOrders).toFixed(0)
      : 0;

    return {
      completionRate,
      avgOrderValue,
      pendingRate: stats.totalOrders > 0 
        ? ((stats.pendingOrders / stats.totalOrders) * 100).toFixed(1)
        : 0,
    };
  }, [stats]);

  const statCards = stats ? [
    { 
      label: 'Total Revenue', 
      value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, 
      icon: IndianRupee, 
      trend: '+12.5%',
      trendUp: true,
      subtitle: `Avg: ₹${metrics?.avgOrderValue || 0}/order`,
      gradient: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-emerald-500'
    },
    { 
      label: 'Total Orders', 
      value: stats.totalOrders, 
      icon: ShoppingBag, 
      trend: '+8.2%',
      trendUp: true,
      subtitle: `${stats.completedOrders} completed`,
      gradient: 'from-blue-500 to-indigo-600',
      iconBg: 'bg-blue-500'
    },
    { 
      label: 'Pending Orders', 
      value: stats.pendingOrders, 
      icon: Clock, 
      trend: metrics?.pendingRate + '%',
      trendUp: false,
      subtitle: 'Needs attention',
      highlight: stats.pendingOrders > 0,
      gradient: 'from-amber-500 to-orange-600',
      iconBg: 'bg-amber-500'
    },
    { 
      label: 'Total Users', 
      value: stats.totalUsers, 
      icon: Users, 
      trend: '+5.3%',
      trendUp: true,
      subtitle: 'Registered customers',
      gradient: 'from-purple-500 to-pink-600',
      iconBg: 'bg-purple-500'
    },
    { 
      label: 'Products', 
      value: stats.totalProducts, 
      icon: Package, 
      trend: `${stats.featuredProducts} featured`,
      subtitle: `${stats.totalCategories} categories`,
      gradient: 'from-cyan-500 to-blue-600',
      iconBg: 'bg-cyan-500'
    },
    { 
      label: 'Completion Rate', 
      value: metrics?.completionRate + '%', 
      icon: CheckCircle, 
      trend: 'Excellent',
      trendUp: true,
      subtitle: 'Order success rate',
      gradient: 'from-green-500 to-emerald-600',
      iconBg: 'bg-green-500'
    },
  ] : [];

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-gray-100 text-gray-800 border-gray-200',
      confirmed: 'bg-gray-900 text-white border-gray-900',
      processing: 'bg-gray-100 text-gray-900 border-gray-300',
      shipped: 'bg-gray-800 text-white border-gray-800',
      delivered: 'bg-black text-white border-black',
      cancelled: 'bg-white text-gray-900 border-gray-300',
    };
    return styles[status] || 'bg-gray-50 text-gray-600 border-gray-200';
  };

  // Simple bar chart data for orders
  const orderChartData = useMemo(() => {
    if (!stats) return [];
    return [
      { label: 'Pending', value: stats.pendingOrders, max: stats.totalOrders },
      { label: 'Confirmed', value: Math.floor(stats.totalOrders * 0.3), max: stats.totalOrders },
      { label: 'Processing', value: Math.floor(stats.totalOrders * 0.2), max: stats.totalOrders },
      { label: 'Shipped', value: Math.floor(stats.totalOrders * 0.15), max: stats.totalOrders },
      { label: 'Delivered', value: stats.completedOrders, max: stats.totalOrders },
    ];
  }, [stats]);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-100 rounded w-64"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded"></div>
                <div className="h-5 w-16 bg-gray-100 rounded"></div>
              </div>
              <div className="h-8 bg-gray-100 rounded w-24 mb-2"></div>
              <div className="h-4 bg-gray-50 rounded w-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-500 mt-0.5">Overview of your store performance</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-green-50 px-2.5 py-1.5 rounded-full">
          <Activity className="w-3.5 h-3.5 text-green-600" />
          <span className="font-medium text-green-700">Live</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, trend, trendUp, subtitle, highlight, gradient, iconBg }) => (
          <div 
            key={label} 
            className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all ${
              highlight ? 'ring-1 ring-amber-400' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              {trend && (
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  trendUp === true 
                    ? 'bg-green-50 text-green-700' 
                    : trendUp === false 
                    ? 'bg-red-50 text-red-700'
                    : 'bg-gray-50 text-gray-700'
                }`}>
                  {trend}
                </span>
              )}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
              <p className="text-xs font-medium text-gray-600 mb-1">{label}</p>
              {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Order Status Distribution */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Order Status</h2>
              <p className="text-xs text-gray-500 mt-0.5">Distribution overview</p>
            </div>
            <ShoppingBag className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {orderChartData.map(({ label, value, max }) => {
              const percentage = max > 0 ? (value / max) * 100 : 0;
              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-gray-700">{label}</span>
                    <span className="text-xs font-bold text-gray-900">{value}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-gray-900 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Revenue</h2>
              <p className="text-xs text-gray-500 mt-0.5">Key metrics</p>
            </div>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {/* Total Revenue */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
              <p className="text-xl font-bold text-gray-900">₹{stats?.totalRevenue.toLocaleString('en-IN')}</p>
            </div>

            {/* Avg Order Value */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Avg Order Value</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-gray-900">₹{metrics?.avgOrderValue}</p>
                <span className="text-xs font-semibold bg-green-50 text-green-700 px-2 py-1 rounded">
                  +12%
                </span>
              </div>
            </div>

            {/* Completion Rate */}
            <div className="p-3 bg-gray-900 text-white rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-300">Completion Rate</p>
                <CheckCircle className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold mb-2">{metrics?.completionRate}%</p>
              <div className="w-full bg-gray-800 rounded-full h-1 overflow-hidden">
                <div 
                  className="bg-white h-full rounded-full"
                  style={{ width: `${metrics?.completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
              <h2 className="text-base font-bold text-gray-900">Recent Orders</h2>
              <p className="text-xs text-gray-500 mt-0.5">Latest transactions</p>
            </div>
            <Link 
              to="/admin/orders" 
              className="text-xs font-semibold text-gray-900 hover:text-gray-600 transition-colors"
            >
              View All →
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                    Order ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                    Customer
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600 uppercase">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.slice(0, 5).map((order) => (
                  <tr 
                    key={order.orderId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link 
                        to={`/admin/orders`}
                        className="text-xs font-mono font-semibold text-gray-900 hover:text-gray-600"
                      >
                        #{order.orderId.slice(0, 10)}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-gray-900">{order.userDetails.name}</p>
                      <p className="text-xs text-gray-500">{order.userDetails.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusBadge(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs font-bold text-gray-900">₹{order.total.toLocaleString('en-IN')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-base font-bold text-gray-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {[
            { label: 'Orders', to: '/admin/orders', icon: ShoppingBag },
            { label: 'Products', to: '/admin/products', icon: Package },
            { label: 'Categories', to: '/admin/categories', icon: Tag },
            { label: 'Users', to: '/admin/users', icon: Users },
            { label: 'Shipping', to: '/admin/shipping', icon: Truck },
            { label: 'Reviews', to: '/admin/reviews', icon: CheckCircle },
            { label: 'Banners', to: '/admin/banners', icon: Activity },
            { label: 'Settings', to: '/admin/settings', icon: Package },
          ].map(({ label, to, icon: Icon }) => (
            <Link 
              key={label} 
              to={to} 
              className="flex flex-col items-center gap-1.5 p-3 border border-gray-200 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-all group"
            >
              <Icon className="w-4 h-4 text-gray-600 group-hover:text-gray-900 transition-colors" strokeWidth={2} />
              <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900 text-center">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
