import { useState, useEffect } from 'react';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { 
  Loader2, Package, Filter, X, ChevronDown, ChevronUp, Search,
  CreditCard, MapPin, Truck, Edit2, Save, Download, RefreshCw
} from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [unseenCount, setUnseenCount] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [editingStatus, setEditingStatus] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: '', trackingNumber: '', note: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [refundModal, setRefundModal] = useState({ open: false, order: null });
  const [refundLoading, setRefundLoading] = useState(false);
  
  const { fetchUnseenCount } = useAdminStore();
  
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    seen: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: 20,
        ...(filters.status && { status: filters.status }),
        ...(filters.paymentStatus && { paymentStatus: filters.paymentStatus }),
        ...(filters.seen && { seen: filters.seen }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      });
      
      const { data } = await api.get(`/admin/orders?${params}`);
      if (data.success) {
        setOrders(data.data.orders);
        setPagination(data.data.pagination);
        setUnseenCount(data.data.unseenCount);
        // Update global count
        fetchUnseenCount();
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, {
        status: 'confirmed',
        note: 'Order accepted by admin'
      });
      toast.success('Order accepted!');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to accept order');
    }
  };

  const handleRejectOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to reject this order?')) return;
    try {
      await api.put(`/admin/orders/${orderId}/status`, {
        status: 'cancelled',
        note: 'Order rejected by admin'
      });
      toast.success('Order rejected');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to reject order');
    }
  };

  const handleStatusUpdate = async (orderId) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, statusForm);
      toast.success('Status updated successfully');
      setEditingStatus(null);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const startEditingStatus = (order) => {
    setEditingStatus(order.orderId);
    setStatusForm({
      status: order.orderStatus,
      trackingNumber: order.trackingNumber || '',
      note: ''
    });
  };

  const handleRefundClick = (order) => {
    setRefundModal({ open: true, order });
  };

  const handleRefundConfirm = async () => {
    if (!refundModal.order) return;
    
    try {
      setRefundLoading(true);
      const { data } = await api.post(`/admin/orders/${refundModal.order.orderId}/refund`);
      
      if (data.success) {
        toast.success(data.message || 'Refund processed successfully');
        setRefundModal({ open: false, order: null });
        fetchOrders();
      }
    } catch (error) {
      console.error('Refund error:', error);
      toast.error(error.response?.data?.message || 'Failed to process refund');
    } finally {
      setRefundLoading(false);
    }
  };

  const handleDownloadReceipt = async (orderId) => {
    try {
      const response = await api.get(`/admin/orders/${orderId}/receipt`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Receipt downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download receipt');
    }
  };

  const toggleOrderExpand = async (orderId) => {
    const order = orders.find(o => o.orderId === orderId);
    
    // If expanding an unseen order, mark it as seen
    if (expandedOrder !== orderId && order && !order.isSeenByAdmin) {
      try {
        await api.put(`/admin/orders/${orderId}/seen`);
        // Update local state
        setOrders(orders.map(o => 
          o.orderId === orderId ? { ...o, isSeenByAdmin: true, seenByAdminAt: new Date() } : o
        ));
        // Update global unseen count
        fetchUnseenCount();
      } catch (error) {
        console.error('Error marking order as seen:', error);
      }
    }
    
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      paymentStatus: '',
      seen: '',
      startDate: '',
      endDate: '',
    });
    setPagination({ ...pagination, page: 1 });
  };

  // Filter orders by search query
  const filteredOrders = orders.filter(order => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.orderId.toLowerCase().includes(query) ||
      order.userDetails.name.toLowerCase().includes(query) ||
      order.userDetails.phone.includes(query) ||
      order.userDetails.email.toLowerCase().includes(query)
    );
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      processing: 'bg-purple-100 text-purple-800 border-purple-200',
      shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      processing: 'Processing',
      completed: 'Paid',
      failed: 'Failed',
      refunded: 'Refunded',
    };
    return labels[status] || status;
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 w-full" style={{ maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Header */}
      <div className="mb-4 sm:mb-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-500 mt-1 text-xs sm:text-sm">
              {pagination.total} total orders
              {unseenCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                  {unseenCount} new
                </span>
              )}
            </p>
          </div>
          
          {/* Filter Button */}
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm sm:text-base"
          >
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filters</span>
            {(filters.status || filters.paymentStatus || filters.seen || filters.startDate || filters.endDate) && (
              <span className="w-2 h-2 bg-primary rounded-full"></span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer Name, Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 mb-4 sm:mb-6 w-full">
        <div className="bg-white rounded-lg border border-gray-200 p-2 sm:p-3">
          <p className="text-xs text-gray-600 mb-1">Total</p>
          <p className="text-lg sm:text-xl font-bold text-gray-900">{pagination.total}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-2 sm:p-3">
          <p className="text-xs text-yellow-700 mb-1">Pending</p>
          <p className="text-lg sm:text-xl font-bold text-yellow-900">
            {orders.filter(o => o.orderStatus === 'pending').length}
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-2 sm:p-3">
          <p className="text-xs text-blue-700 mb-1">Confirmed</p>
          <p className="text-lg sm:text-xl font-bold text-blue-900">
            {orders.filter(o => o.orderStatus === 'confirmed').length}
          </p>
        </div>
        <div className="bg-indigo-50 rounded-lg border border-indigo-200 p-2 sm:p-3">
          <p className="text-xs text-indigo-700 mb-1">Shipped</p>
          <p className="text-lg sm:text-xl font-bold text-indigo-900">
            {orders.filter(o => o.orderStatus === 'shipped').length}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-2 sm:p-3 col-span-2 sm:col-span-1">
          <p className="text-xs text-green-700 mb-1">Delivered</p>
          <p className="text-lg sm:text-xl font-bold text-green-900">
            {orders.filter(o => o.orderStatus === 'delivered').length}
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm w-full" style={{ maxWidth: '100%', overflowX: 'hidden' }}>
        {filteredOrders.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm sm:text-base">
              {searchQuery ? 'No orders found matching your search' : 'No orders found'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 overflow-hidden">
            {filteredOrders.map((order, index) => {
              // Calculate serial number based on pagination
              const serialNumber = (pagination.page - 1) * 20 + index + 1;
              
              return (
                <div 
                  key={order.orderId} 
                  className="p-3 sm:p-4 transition-colors"
                  style={{ 
                    backgroundColor: !order.isSeenByAdmin ? 'rgba(239, 246, 255, 0.3)' : 'transparent',
                    maxWidth: '100%',
                    overflow: 'hidden'
                  }}
                >
                {/* Order Header - Fully Clickable */}
                <div 
                  onClick={() => toggleOrderExpand(order.orderId)}
                  className="cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                  style={{ margin: '-12px', padding: '12px' }}
                >
                  <div className="flex items-center w-full" style={{ gap: '8px' }}>
                    {/* Serial + Chevron */}
                    <div className="flex items-center" style={{ gap: '4px', flexShrink: 0 }}>
                      <div style={{ width: '32px', height: '32px', backgroundColor: 'rgba(2, 35, 99, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#022363' }}>#{serialNumber}</span>
                      </div>
                      <div style={{ padding: '4px', borderRadius: '4px', flexShrink: 0 }}>
                        {expandedOrder === order.orderId ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                      {!order.isSeenByAdmin && (
                        <div style={{ width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%', flexShrink: 0 }}></div>
                      )}
                    </div>
                    
                    {/* Order Info */}
                    <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <p style={{ fontWeight: 600, color: '#111827', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={`Order #${order.orderId}`}>
                          #{order.orderId.slice(-10)}
                        </p>
                        {!order.isSeenByAdmin && (
                          <span style={{ padding: '2px 6px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px', fontSize: '11px', fontWeight: 500, flexShrink: 0 }}>
                            NEW
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '12px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {new Date(order.createdAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </p>
                    </div>
                    
                    {/* Status + Amount */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {getPaymentStatusLabel(order.paymentStatus)}
                      </span>
                      <span style={{ fontWeight: 'bold', color: '#022363', fontSize: '14px', whiteSpace: 'nowrap' }}>₹{Number(order.total) || 0}</span>
                      
                      {/* Quick Actions */}
                      {order.paymentStatus === 'completed' && order.orderStatus === 'pending' && (
                        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleAcceptOrder(order.orderId)}
                            style={{ padding: '4px 8px', backgroundColor: '#16a34a', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: 500, border: 'none', cursor: 'pointer' }}
                            title="Accept"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => handleRejectOrder(order.orderId)}
                            style={{ padding: '4px 8px', backgroundColor: '#dc2626', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: 500, border: 'none', cursor: 'pointer' }}
                            title="Reject"
                          >
                            ✗
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: '#6b7280', marginTop: '8px', marginLeft: '40px', overflow: 'hidden' }}>
                    <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }} title={order.userDetails.name}>{order.userDetails.name}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }} title={order.userDetails.phone}>{order.userDetails.phone}</span>
                    <span style={{ whiteSpace: 'nowrap' }}>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }} title={`${order.shippingAddress.city}, ${order.shippingAddress.state}`}>{order.shippingAddress.city}, {order.shippingAddress.state}</span>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order.orderId && (
                  <div className="mt-4 ml-0 sm:ml-9 space-y-3 sm:space-y-4">
                    {/* Items */}
                    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 overflow-x-auto">
                      <h4 className="font-semibold text-xs sm:text-sm mb-3 flex items-center gap-2">
                        <Package className="w-4 h-4 text-primary flex-shrink-0" />
                        Order Items
                      </h4>
                      <div className="space-y-2 min-w-[280px]">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between py-2 border-b last:border-b-0 gap-3">
                            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                              {item.image && (
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded border border-gray-200 flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-xs sm:text-sm truncate">{item.name}</p>
                                <p className="text-xs text-gray-500">{item.unit} × {item.quantity}</p>
                              </div>
                            </div>
                            <span className="font-semibold text-xs sm:text-sm whitespace-nowrap">₹{Number(item.subtotal) || 0}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-600">Total Amount</span>
                        <span className="text-base sm:text-lg font-bold text-primary">₹{Number(order.total) || 0}</span>
                      </div>
                    </div>

                    {/* Address & Payment */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 overflow-hidden">
                        <h4 className="font-semibold text-xs sm:text-sm mb-3 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                          Shipping Address
                        </h4>
                        <div className="text-xs sm:text-sm text-gray-700 space-y-1 break-words">
                          <p className="font-medium">{order.shippingAddress.fullName}</p>
                          <p>{order.shippingAddress.phone}</p>
                          <p>{order.shippingAddress.line1}</p>
                          {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                          <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                          <p>PIN: {order.shippingAddress.pincode}</p>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 overflow-hidden">
                        <h4 className="font-semibold text-xs sm:text-sm mb-3 flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-primary flex-shrink-0" />
                          Payment Details
                        </h4>
                        <div className="text-xs sm:text-sm space-y-2">
                          <div>
                            <p className="text-gray-600 text-xs">Payment Method</p>
                            <p className="font-medium capitalize">{order.paymentMethod}</p>
                          </div>
                          {order.razorpayPaymentId && (
                            <div>
                              <p className="text-gray-600 text-xs">Transaction ID</p>
                              <p className="font-mono text-xs break-all">{order.razorpayPaymentId}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Management */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <Truck className="w-4 h-4 text-primary" />
                        Order Status Management
                      </h4>
                      
                      {editingStatus === order.orderId ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Update Status</label>
                            <select
                              value={statusForm.status}
                              onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Tracking Number (Optional)</label>
                            <input
                              type="text"
                              value={statusForm.trackingNumber}
                              onChange={(e) => setStatusForm({ ...statusForm, trackingNumber: e.target.value })}
                              placeholder="Enter tracking number"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Note (Optional)</label>
                            <textarea
                              value={statusForm.note}
                              onChange={(e) => setStatusForm({ ...statusForm, note: e.target.value })}
                              placeholder="Add a note about this status update"
                              rows="2"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                            />
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusUpdate(order.orderId)}
                              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                            >
                              <Save className="w-4 h-4" />
                              Save Changes
                            </button>
                            <button
                              onClick={() => setEditingStatus(null)}
                              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Current Status</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                              {order.orderStatus}
                            </span>
                            {order.trackingNumber && (
                              <p className="text-xs text-gray-600 mt-2">
                                Tracking: <span className="font-mono font-medium">{order.trackingNumber}</span>
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => startEditingStatus(order)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                            Update Status
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {/* Download Receipt Button */}
                      {order.paymentStatus === 'completed' && (
                        <button
                          onClick={() => handleDownloadReceipt(order.orderId)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download Receipt
                        </button>
                      )}
                      
                      {/* Refund Button */}
                      {order.paymentStatus === 'completed' && (
                        <button
                          onClick={() => handleRefundClick(order)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Process Refund
                        </button>
                      )}
                      
                      {/* Refunded Badge */}
                      {order.paymentStatus === 'refunded' && (
                        <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-100 text-orange-800 rounded-lg text-sm font-medium border border-orange-200">
                          <RefreshCw className="w-4 h-4" />
                          Refunded: ₹{order.refundDetails?.amount || order.subtotal}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2">
          <button
            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
            disabled={pagination.page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-medium text-sm"
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
            {[...Array(pagination.pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPagination({ ...pagination, page: i + 1 })}
                className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${
                  pagination.page === i + 1
                    ? 'bg-primary text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-medium text-sm"
          >
            Next
          </button>
        </div>
      )}

      {/* Filter Sidebar */}
      {filterOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setFilterOpen(false)}
          ></div>
          
          {/* Sidebar */}
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filters */}
              <div className="space-y-4">
                {/* Order Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                  <select
                    value={filters.paymentStatus}
                    onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  >
                    <option value="">All Payment Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                {/* Seen/Unseen */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">View Status</label>
                  <select
                    value={filters.seen}
                    onChange={(e) => setFilters({ ...filters, seen: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  >
                    <option value="">All Orders</option>
                    <option value="false">Unseen Only</option>
                    <option value="true">Seen Only</option>
                  </select>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => {
                    setPagination({ ...pagination, page: 1 });
                    setFilterOpen(false);
                  }}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => {
                    clearFilters();
                    setFilterOpen(false);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Refund Confirmation Modal */}
      {refundModal.open && refundModal.order && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => !refundLoading && setRefundModal({ open: false, order: null })}
          >
            {/* Modal */}
            <div 
              className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Confirm Refund</h3>
                <button
                  onClick={() => !refundLoading && setRefundModal({ open: false, order: null })}
                  disabled={refundLoading}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-orange-800 font-medium mb-2">
                    ⚠️ This action cannot be undone
                  </p>
                  <p className="text-xs text-orange-700">
                    The refund will be processed through Razorpay and the amount will be credited to the customer's account.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-gray-600">Order ID</span>
                    <span className="text-sm font-semibold">#{refundModal.order.orderId}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-gray-600">Customer</span>
                    <span className="text-sm font-medium">{refundModal.order.userDetails.name}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-gray-600">Product Amount</span>
                    <span className="text-sm font-medium">₹{Number(refundModal.order.subtotal) || 0}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-gray-600">Delivery Charge</span>
                    <span className="text-sm font-medium text-gray-500">₹{Number(refundModal.order.deliveryCharge) || 0} (Not refunded)</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 bg-green-50 rounded-lg px-3 mt-3">
                    <span className="text-base font-semibold text-gray-900">Refund Amount</span>
                    <span className="text-xl font-bold text-green-600">₹{Number(refundModal.order.subtotal) || 0}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Only the product amount will be refunded. Delivery charges are non-refundable.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setRefundModal({ open: false, order: null })}
                  disabled={refundLoading}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRefundConfirm}
                  disabled={refundLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  {refundLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Confirm Refund
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrders;
