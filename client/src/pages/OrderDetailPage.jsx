import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { 
  Loader2, Package, MapPin, CreditCard, Truck, Calendar, 
  CheckCircle, XCircle, Clock, Download, ArrowLeft, Phone, User
} from 'lucide-react';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [retryingPayment, setRetryingPayment] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRetryPayment = async () => {
    try {
      setRetryingPayment(true);
      
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway');
        return;
      }

      // Call retry payment API
      const { data } = await api.post(`/orders/${orderId}/retry-payment`);
      
      if (!data.success) {
        toast.error(data.message || 'Failed to initiate payment');
        return;
      }

      const { razorpayOrderId, amount, keyId } = data.order;

      // Razorpay options
      const options = {
        key: keyId,
        amount: amount * 100,
        currency: 'INR',
        name: 'Annakshetram',
        description: `Retry Payment - Order #${orderId}`,
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyData = await api.post('/orders/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyData.data.success) {
              toast.success('Payment successful!');
              fetchOrderDetails();
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: order.userDetails.name,
          email: order.userDetails.email,
          contact: order.userDetails.phone,
        },
        theme: {
          color: '#16a34a',
        },
        modal: {
          ondismiss: async function() {
            try {
              await api.post('/orders/payment-failed', {
                razorpay_order_id: razorpayOrderId,
                error: { reason: 'Payment cancelled by user' },
              });
              toast.error('Payment cancelled');
              fetchOrderDetails();
            } catch (error) {
              console.error('Error recording payment failure:', error);
            }
          }
        },
        method: {
          upi: {
            flow: 'intent',
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Retry payment error:', error);
      toast.error(error.response?.data?.message || 'Failed to retry payment');
    } finally {
      setRetryingPayment(false);
    }
  };

  const handlePrint = async () => {
    try {
      // Download PDF from backend
      const token = localStorage.getItem('annakshetram_token');
      
      if (!token) {
        toast.error('Please login to download receipt');
        return;
      }
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/orders/${orderId}/receipt`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please login again');
          return;
        }
        throw new Error('Failed to download receipt');
      }

      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${order.orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Receipt downloaded successfully');
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast.error('Failed to download receipt');
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/orders/${orderId}`);
      if (data.success) {
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      setCancelling(true);
      const { data } = await api.put(`/orders/${orderId}/cancel`, {
        reason: 'Cancelled by user',
      });
      if (data.success) {
        toast.success('Order cancelled successfully');
        fetchOrderDetails();
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
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
        description: 'Your order has been placed successfully'
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

  const getPaymentStatusBadge = (status) => {
    const badges = {
      completed: { text: '✓ Paid', class: 'bg-green-100 text-green-700' },
      failed: { text: '✗ Failed', class: 'bg-red-100 text-red-700' },
      refunded: { text: '↻ Refunded', class: 'bg-orange-100 text-orange-700' },
      pending: { text: '⏳ Pending', class: 'bg-yellow-100 text-yellow-700' },
    };
    return badges[status] || badges.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) return null;

  const canCancel = ['pending', 'confirmed'].includes(order.orderStatus);
  const canRetryPayment = ['pending', 'failed'].includes(order.paymentStatus) && order.orderStatus !== 'cancelled';
  const statusConfig = getStatusConfig(order.orderStatus);
  const StatusIcon = statusConfig.icon;
  const paymentBadge = getPaymentStatusBadge(order.paymentStatus);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Status Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <button
            onClick={() => navigate('/orders')}
            className="text-primary hover:text-primary/80 mb-2 sm:mb-3 flex items-center gap-2 font-medium transition-colors text-xs sm:text-sm"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            Back to Orders
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Order #{order.orderId}</h1>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {order.paymentStatus === 'completed' && (
                <button
                  onClick={handlePrint}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm shadow-sm"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  Receipt
                </button>
              )}
              
              {canRetryPayment && (
                <button
                  onClick={handleRetryPayment}
                  disabled={retryingPayment}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {retryingPayment ? (
                    <>
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                      <span className="hidden sm:inline">Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                      Retry Payment
                    </>
                  )}
                </button>
              )}
              
              {canCancel && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Status Card */}
        <div className={`${statusConfig.bg} ${statusConfig.border} border rounded-lg p-3 sm:p-4 mb-4 sm:mb-6`}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className={`p-2 rounded-full ${statusConfig.bg} border ${statusConfig.border} self-start sm:self-auto`}>
              <StatusIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${statusConfig.color}`} />
            </div>
            <div className="flex-1">
              <p className={`font-semibold text-sm sm:text-base ${statusConfig.color}`}>{statusConfig.label}</p>
              <p className="text-xs sm:text-sm text-gray-600">{statusConfig.description}</p>
            </div>
            {order.trackingNumber && (
              <div className="text-left sm:text-right">
                <p className="text-xs text-gray-500">Tracking Number</p>
                <p className="text-xs sm:text-sm font-mono font-semibold text-gray-900 break-all">{order.trackingNumber}</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="font-semibold text-sm sm:text-base text-gray-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  Order Items ({order.items.length})
                </h2>
              </div>
              <div className="p-3 sm:p-5">
                <div className="space-y-3 sm:space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3 sm:gap-4 pb-3 sm:pb-4 border-b last:border-b-0 last:pb-0">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                        <img
                          src={item.image || '/placeholder.png'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{item.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{item.unit}</p>
                        <p className="text-xs text-gray-600 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">₹{Number(item.subtotal) || (Number(item.price) * Number(item.quantity))}</p>
                        <p className="text-xs text-gray-500 mt-1">₹{Number(item.price) || 0} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="font-semibold text-sm sm:text-base text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Delivery Address
                </h2>
              </div>
              <div className="p-3 sm:p-5">
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                    <p className="font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                    <p className="text-gray-700">{order.shippingAddress.phone}</p>
                  </div>
                  <div className="flex items-start gap-2 mt-3">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="text-gray-700">
                      <p>{order.shippingAddress.line1}</p>
                      {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                      <p className="mt-1">
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="font-semibold text-sm sm:text-base text-gray-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Order Timeline
                  </h2>
                </div>
                <div className="p-3 sm:p-5">
                  <div className="space-y-3 sm:space-y-4">
                    {order.statusHistory.slice().reverse().map((history, idx) => (
                      <div key={idx} className="flex gap-2 sm:gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center ${
                            idx === 0 ? 'bg-primary' : 'bg-green-500'
                          }`}>
                            <CheckCircle className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-white" />
                          </div>
                          {idx < order.statusHistory.length - 1 && (
                            <div className="w-0.5 flex-1 bg-green-300 my-1" style={{ minHeight: '20px' }} />
                          )}
                        </div>
                        <div className="flex-1 pb-2">
                          <p className="font-medium text-xs sm:text-sm text-gray-900">
                            {history.status.charAt(0).toUpperCase() + history.status.slice(1)}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {new Date(history.timestamp).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          {history.note && (
                            <p className="text-xs text-gray-600 mt-1 bg-gray-50 rounded px-2 py-1">{history.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Payment Summary */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden lg:sticky lg:top-4">
              <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="font-semibold text-sm sm:text-base text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  Payment Summary
                </h2>
              </div>
              <div className="p-3 sm:p-5">
                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">₹{Number(order.subtotal) || 0}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-medium text-gray-900">
                      {Number(order.deliveryCharge) === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${Number(order.deliveryCharge) || 0}`
                      )}
                    </span>
                  </div>
                  {Number(order.discount) > 0 && (
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-green-600">-₹{Number(order.discount) || 0}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 sm:pt-3 flex justify-between">
                    <span className="font-semibold text-sm sm:text-base text-gray-900">Total Amount</span>
                    <span className="font-bold text-primary text-base sm:text-lg">₹{Number(order.total) || 0}</span>
                  </div>
                </div>

                <div className="border-t pt-3 sm:pt-4 space-y-2 sm:space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                    <p className="font-medium text-xs sm:text-sm capitalize text-gray-900">{order.paymentMethod}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Payment Status</p>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${paymentBadge.class}`}>
                      {paymentBadge.text}
                    </span>
                    {order.paymentStatus === 'refunded' && order.refundDetails && (
                      <p className="text-xs text-orange-600 mt-1">
                        Refunded: ₹{order.refundDetails.amount || order.subtotal}
                      </p>
                    )}
                  </div>

                  {order.razorpayPaymentId && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                      <p className="text-xs font-mono text-gray-700 break-all bg-gray-50 rounded px-2 py-1">
                        {order.razorpayPaymentId}
                      </p>
                    </div>
                  )}
                </div>

                {order.notes && (
                  <div className="border-t pt-3 sm:pt-4 mt-3 sm:mt-4">
                    <p className="text-xs text-gray-500 mb-1">Order Notes</p>
                    <p className="text-xs sm:text-sm text-gray-700 bg-gray-50 rounded px-3 py-2">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
