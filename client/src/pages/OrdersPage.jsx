import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { Loader2, Package, ChevronRight, Calendar, MapPin, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [pagination.page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/orders/my-orders?page=${pagination.page}&limit=10`);
      if (data.success) {
        setOrders(data.orders);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        icon: Clock, 
        color: 'text-yellow-600', 
        bg: 'bg-yellow-50', 
        border: 'border-yellow-200',
        label: 'Order Placed',
        description: 'Your order has been placed'
      },
      confirmed: { 
        icon: CheckCircle, 
        color: 'text-blue-600', 
        bg: 'bg-blue-50', 
        border: 'border-blue-200',
        label: 'Confirmed',
        description: 'Order confirmed by seller'
      },
      processing: { 
        icon: Package, 
        color: 'text-purple-600', 
        bg: 'bg-purple-50', 
        border: 'border-purple-200',
        label: 'Processing',
        description: 'Your order is being prepared'
      },
      shipped: { 
        icon: Truck, 
        color: 'text-indigo-600', 
        bg: 'bg-indigo-50', 
        border: 'border-indigo-200',
        label: 'Shipped',
        description: 'Your order is on the way'
      },
      delivered: { 
        icon: CheckCircle, 
        color: 'text-green-600', 
        bg: 'bg-green-50', 
        border: 'border-green-200',
        label: 'Delivered',
        description: 'Order delivered successfully'
      },
      cancelled: { 
        icon: XCircle, 
        color: 'text-red-600', 
        bg: 'bg-red-50', 
        border: 'border-red-200',
        label: 'Cancelled',
        description: 'Order has been cancelled'
      },
    };
    return configs[status] || configs.pending;
  };

  const filterOrders = (status) => {
    if (status === 'all') return orders;
    return orders.filter(order => order.orderStatus === status);
  };

  const filteredOrders = filterOrders(activeFilter);

  const filters = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'pending', label: 'Pending', count: orders.filter(o => o.orderStatus === 'pending').length },
    { id: 'confirmed', label: 'Confirmed', count: orders.filter(o => o.orderStatus === 'confirmed').length },
    { id: 'shipped', label: 'Shipped', count: orders.filter(o => o.orderStatus === 'shipped').length },
    { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.orderStatus === 'delivered').length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Package className="w-7 h-7 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
              <p className="text-sm text-gray-500 mt-0.5">{pagination.total} total orders</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === filter.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
                {filter.count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeFilter === filter.id ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {filter.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {activeFilter === 'all' ? 'No orders yet' : `No ${activeFilter} orders`}
            </h2>
            <p className="text-gray-500 mb-6">
              {activeFilter === 'all' 
                ? 'Start shopping to see your orders here' 
                : `You don't have any ${activeFilter} orders`}
            </p>
            {activeFilter === 'all' && (
              <Link
                to="/products"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Browse Products
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.orderStatus);
              const StatusIcon = statusConfig.icon;
              
              return (
                <Link
                  key={order.orderId}
                  to={`/orders/${order.orderId}`}
                  className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden group"
                >
                  {/* Status Bar */}
                  <div className={`${statusConfig.bg} ${statusConfig.border} border-b px-6 py-3`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                        <div>
                          <p className={`font-semibold text-sm ${statusConfig.color}`}>
                            {statusConfig.label}
                          </p>
                          <p className="text-xs text-gray-600">{statusConfig.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Order ID</p>
                        <p className="font-mono text-sm font-semibold text-gray-900">#{order.orderId}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      {/* Order Items Preview */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                          {/* First Item Image */}
                          {order.items[0]?.image && (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                              <img 
                                src={order.items[0].image} 
                                alt={order.items[0].name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          
                          {/* Items Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm sm:text-base mb-1 truncate">
                              {order.items[0]?.name}
                            </p>
                            {order.items.length > 1 && (
                              <p className="text-xs sm:text-sm text-gray-500">
                                +{order.items.length - 1} more item{order.items.length > 2 ? 's' : ''}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-3 text-xs text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                <span className="truncate">{new Date(order.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Package className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                <span className="whitespace-nowrap">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                              </div>
                              {order.trackingNumber && (
                                <div className="flex items-center gap-1 w-full sm:w-auto">
                                  <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                  <span className="truncate">{order.trackingNumber}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Delivery Address */}
                        {order.shippingAddress && (
                          <div className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg p-2 sm:p-3">
                            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-700">Delivery Address</p>
                              <p className="mt-0.5 truncate">
                                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Order Summary */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between border-t sm:border-t-0 sm:border-l border-gray-200 pt-3 sm:pt-0 sm:pl-4 sm:pl-6 sm:min-w-[140px]">
                        <div className="text-left sm:text-right">
                          <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                          <p className="text-xl sm:text-2xl font-bold text-primary whitespace-nowrap">₹{Number(order.total) || 0}</p>
                          <p className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${
                            order.paymentStatus === 'completed' 
                              ? 'bg-green-100 text-green-700' 
                              : order.paymentStatus === 'failed'
                              ? 'bg-red-100 text-red-700'
                              : order.paymentStatus === 'refunded'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.paymentStatus === 'completed' ? '✓ Paid' : 
                             order.paymentStatus === 'failed' ? '✗ Failed' : 
                             order.paymentStatus === 'refunded' ? '↻ Refunded' :
                             '⏳ Pending'}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 text-primary font-medium text-xs sm:text-sm group-hover:gap-3 transition-all whitespace-nowrap">
                          <span className="hidden sm:inline">View Details</span>
                          <span className="sm:hidden">View</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-5 py-2.5 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-medium text-sm transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center px-4 py-2.5 text-sm text-gray-700 font-medium">
              Page {pagination.page} of {pagination.pages}
            </div>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.pages}
              className="px-5 py-2.5 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-medium text-sm transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
