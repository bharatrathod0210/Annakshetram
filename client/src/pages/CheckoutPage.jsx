import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import api, { imgUrl } from '../lib/api';
import toast from 'react-hot-toast';
import { 
  Loader2, ShoppingBag, Truck, CreditCard, MapPin, Lock, 
  CheckCircle, ArrowLeft, Shield, AlertCircle
} from 'lucide-react';
import { 
  getCitiesForState, 
  validateCityInState, 
  validatePincode, 
  validatePincodeForState 
} from '../lib/indianCities';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({ isLocal: false, nextFreeShippingThreshold: null });
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  const [cityWarning, setCityWarning] = useState('');
  const [pincodeWarning, setPincodeWarning] = useState('');

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    line1: user?.address?.line1 || '',
    line2: user?.address?.line2 || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });

  const total = getTotal();
  const discount = 0;
  const finalTotal = Number(total) + Number(deliveryCharge) - Number(discount);

  useEffect(() => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/products');
    }
  }, [items, navigate]);

  // Calculate shipping when state changes
  useEffect(() => {
    const calculateShippingCharge = async () => {
      if (!shippingAddress.state) {
        setDeliveryCharge(0);
        return;
      }

      setCalculatingShipping(true);
      try {
        const { data } = await api.post('/orders/calculate-shipping', {
          state: shippingAddress.state,
          orderTotal: total,
        });

        if (data.success) {
          setDeliveryCharge(Number(data.deliveryCharge) || 0);
          setShippingInfo({
            isLocal: data.isLocal,
            nextFreeShippingThreshold: data.nextFreeShippingThreshold,
            localState: data.localState,
          });
        }
      } catch (error) {
        console.error('Error calculating shipping:', error);
        // Fallback to default charge
        setDeliveryCharge(50);
      } finally {
        setCalculatingShipping(false);
      }
    };

    calculateShippingCharge();
  }, [shippingAddress.state, total]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));

    // Validate city when it changes
    if (name === 'city' && shippingAddress.state) {
      const isValid = validateCityInState(value, shippingAddress.state);
      if (value && !isValid) {
        setCityWarning(`⚠️ "${value}" may not be in ${shippingAddress.state}. Please verify.`);
      } else {
        setCityWarning('');
      }
    }

    // Validate pincode when it changes
    if (name === 'pincode') {
      if (value && !validatePincode(value)) {
        setPincodeWarning('⚠️ Invalid pincode format. Must be 6 digits.');
      } else if (value && shippingAddress.state && !validatePincodeForState(value, shippingAddress.state)) {
        setPincodeWarning(`⚠️ This pincode may not belong to ${shippingAddress.state}. Please verify.`);
      } else {
        setPincodeWarning('');
      }
    }

    // Clear warnings when state changes
    if (name === 'state') {
      setCityWarning('');
      setPincodeWarning('');
    }
  };

  const validateAddress = () => {
    const required = ['fullName', 'phone', 'line1', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!shippingAddress[field]?.trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Accept phone with or without +91 prefix
    const phoneRegex = /^(\+91)?[0-9]{10}$/;
    if (!phoneRegex.test(shippingAddress.phone.replace(/\s/g, ''))) {
      toast.error('Please enter a valid phone number (10 digits with optional +91)');
      return false;
    }

    // Validate pincode format
    if (!validatePincode(shippingAddress.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }

    // Validate city in state
    if (!validateCityInState(shippingAddress.city, shippingAddress.state)) {
      toast.error(`"${shippingAddress.city}" does not appear to be in ${shippingAddress.state}. Please check your address.`);
      return false;
    }

    // Validate pincode for state
    if (!validatePincodeForState(shippingAddress.pincode, shippingAddress.state)) {
      toast.error(`Pincode ${shippingAddress.pincode} does not match ${shippingAddress.state}. Please verify your address.`);
      return false;
    }

    return true;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!validateAddress()) return;

    // Check if delivery charge is calculated
    if (!shippingAddress.state) {
      toast.error('Please select a delivery state');
      return;
    }

    if (calculatingShipping) {
      toast.error('Please wait while we calculate delivery charges');
      return;
    }

    setLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway. Please try again.');
        setLoading(false);
        return;
      }

      const { data } = await api.post('/orders/create', {
        shippingAddress,
        discount,
      });

      if (!data.success) {
        throw new Error(data.message || 'Failed to create order');
      }

      const { orderId, razorpayOrderId, amount, currency, keyId } = data.order;

      const options = {
        key: keyId,
        amount: amount * 100,
        currency: currency,
        name: 'Annakshetram',
        description: 'Shuddham Bhojanam • Satvikam Jeevanam',
        image: '/logo.png',
        order_id: razorpayOrderId,
        prefill: {
          name: shippingAddress.fullName,
          email: user?.email || '',
          contact: shippingAddress.phone,
        },
        theme: {
          color: '#16a34a',
        },
        // Enable UPI Intent for direct app redirect
        method: {
          upi: {
            flow: 'intent', // This enables direct app redirect
          },
        },
        handler: async function (response) {
          setProcessingPayment(true);
          try {
            const verifyRes = await api.post('/orders/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              clearCart();
              toast.success('🎉 Payment successful! Order placed.');
              navigate(`/orders/${orderId}`);
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error(error.response?.data?.message || 'Payment verification failed');
          } finally {
            setProcessingPayment(false);
          }
        },
        modal: {
          ondismiss: async function () {
            setLoading(false);
            try {
              await api.post('/orders/payment-failed', {
                razorpay_order_id: razorpayOrderId,
                error: { reason: 'Payment cancelled by user' },
              });
            } catch (error) {
              console.error('Error recording payment failure:', error);
            }
            toast.error('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setLoading(false);

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Failed to process checkout');
      setLoading(false);
    }
  };

  if (processingPayment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-10 rounded-lg shadow-lg max-w-md">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Payment</h3>
          <p className="text-gray-600 text-sm">Please wait, do not close this page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary-light transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Shopping</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-900">Delivery Address</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingAddress.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    placeholder="+91 XXXXX XXXXX or 10 digits"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={shippingAddress.pincode}
                    onChange={handleInputChange}
                    placeholder="6-digit pincode"
                    maxLength="6"
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                      pincodeWarning ? 'border-amber-400 bg-amber-50' : 'border-gray-300'
                    }`}
                    required
                  />
                  {pincodeWarning && (
                    <div className="mt-1.5 flex items-start gap-1.5 text-xs text-amber-700">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <span>{pincodeWarning}</span>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="line1"
                    value={shippingAddress.line1}
                    onChange={handleInputChange}
                    placeholder="House No., Building Name, Street"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Address Line 2 <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="line2"
                    value={shippingAddress.line2}
                    onChange={handleInputChange}
                    placeholder="Landmark, Area, Colony"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                      cityWarning ? 'border-amber-400 bg-amber-50' : 'border-gray-300'
                    }`}
                    required
                  />
                  {cityWarning && (
                    <div className="mt-1.5 flex items-start gap-1.5 text-xs text-amber-700">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <span>{cityWarning}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900">Secure Payment</p>
                  <p className="text-xs text-gray-500">100% Safe & Encrypted</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900">Fast Delivery</p>
                  <p className="text-xs text-gray-500">2-5 Business Days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4">
              <div className="p-5 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                </div>
              </div>

              <div className="p-5">
                {/* Order Items */}
                <div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      {item.image && (
                        <img 
                          src={imgUrl(item.image)} 
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-lg flex-shrink-0 border border-gray-200"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.unit}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-600">Qty: {item.quantity}</span>
                          <span className="font-semibold text-sm text-gray-900">₹{item.price * item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-200 pt-4 space-y-2.5 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">₹{total || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Charge</span>
                    <span className="font-medium text-gray-900">
                      {calculatingShipping ? (
                        <span className="text-gray-400">Calculating...</span>
                      ) : deliveryCharge === 0 ? (
                        <span className="text-gray-900">₹0</span>
                      ) : (
                        <span>₹{deliveryCharge || 0}</span>
                      )}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-green-600">-₹{discount}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2.5 flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-primary">₹{finalTotal || 0}</span>
                  </div>
                </div>

                {/* Shipping Info */}
                {shippingAddress.state && (
                  <div className="mb-5 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold">Delivery to:</span> {shippingAddress.state}
                      {shippingInfo.isLocal && shippingInfo.localState && (
                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                          Local Delivery
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {/* Payment Button */}
                <button
                  onClick={handlePayment}
                  disabled={loading || items.length === 0}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>Proceed to Payment</span>
                    </>
                  )}
                </button>

                {/* Payment Methods */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500 mb-2.5">We accept all payment methods</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="px-3 py-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                      <p className="text-xs font-semibold text-purple-700">UPI</p>
                      <p className="text-[10px] text-purple-600">GPay, PhonePe, Paytm</p>
                    </div>
                    <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                      <p className="text-xs font-semibold text-blue-700">Cards</p>
                      <p className="text-[10px] text-blue-600">Credit & Debit</p>
                    </div>
                    <div className="px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <p className="text-xs font-semibold text-green-700">Wallets</p>
                      <p className="text-[10px] text-green-600">Paytm, PhonePe, etc</p>
                    </div>
                    <div className="px-3 py-2 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                      <p className="text-xs font-semibold text-orange-700">Net Banking</p>
                      <p className="text-[10px] text-orange-600">All Banks</p>
                    </div>
                  </div>
                </div>

                {/* Razorpay Badge */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-500">Secured by</span>
                  <img 
                    src="https://razorpay.com/assets/razorpay-glyph.svg" 
                    alt="Razorpay" 
                    className="h-3.5"
                  />
                  <span className="text-xs font-medium text-gray-700">Razorpay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
