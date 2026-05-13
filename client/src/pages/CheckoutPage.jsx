import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import api, { imgUrl } from '../lib/api';
import toast from 'react-hot-toast';
import {
  Loader2,
  ShoppingBag,
  Truck,
  MapPin,
  Lock,
  ArrowLeft,
  Shield,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import {
  getCitiesForState,
  validateCityInState,
  validatePincode,
  validatePincodeForState,
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
        setDeliveryCharge(50);
      } finally {
        setCalculatingShipping(false);
      }
    };

    calculateShippingCharge();
  }, [shippingAddress.state, total]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));

    if (name === 'city' && shippingAddress.state) {
      const isValid = validateCityInState(value, shippingAddress.state);
      if (value && !isValid) {
        setCityWarning(`"${value}" may not be in ${shippingAddress.state}. Please verify.`);
      } else {
        setCityWarning('');
      }
    }

    if (name === 'pincode') {
      if (value && !validatePincode(value)) {
        setPincodeWarning('Invalid pincode — use 6 digits.');
      } else if (value && shippingAddress.state && !validatePincodeForState(value, shippingAddress.state)) {
        setPincodeWarning(`This pincode may not belong to ${shippingAddress.state}. Please verify.`);
      } else {
        setPincodeWarning('');
      }
    }

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

    const phoneRegex = /^(\+91)?[0-9]{10}$/;
    if (!phoneRegex.test(shippingAddress.phone.replace(/\s/g, ''))) {
      toast.error('Please enter a valid phone number (10 digits with optional +91)');
      return false;
    }

    if (!validatePincode(shippingAddress.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }

    if (!validateCityInState(shippingAddress.city, shippingAddress.state)) {
      toast.error(`"${shippingAddress.city}" does not appear to be in ${shippingAddress.state}. Please check your address.`);
      return false;
    }

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
        image: `${import.meta.env.VITE_CLIENT_URL}/logo.png`,
        order_id: razorpayOrderId,
        prefill: {
          name: shippingAddress.fullName,
          email: user?.email || '',
          contact: shippingAddress.phone,
        },
        theme: {
          color: '#16a34a',
        },
        method: {
          upi: {
            flow: 'intent',
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
              toast.success('Payment successful! Order placed.');
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

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm rounded-md border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/25';

  if (processingPayment) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center font-body px-4">
        <div className="text-center bg-white p-10 rounded-lg border border-neutral-200 shadow-sm max-w-sm w-full">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-base font-semibold text-neutral-900">Verifying payment</p>
          <p className="text-sm text-neutral-500 mt-2">Please do not close this window.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-body pb-16">
      {/* Slim top bar — Myntra-style secure checkout */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-neutral-500">
            <Lock className="w-3.5 h-3.5 text-neutral-400" aria-hidden />
            <span>Secure checkout</span>
          </div>
          <nav className="flex items-center gap-1 text-xs sm:text-sm text-neutral-600" aria-label="Checkout steps">
            <span className="font-medium text-primary">Bag</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300 flex-shrink-0" aria-hidden />
            <span className="font-semibold text-neutral-900">Address</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300 flex-shrink-0" aria-hidden />
            <span className="text-neutral-400">Payment</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue shopping
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Main column */}
          <div className="lg:col-span-7 space-y-6">
            <header className="space-y-1">
              <h1 className="font-body text-2xl sm:text-[1.65rem] font-semibold text-neutral-900 tracking-tight">
                Delivery details
              </h1>
              <p className="text-sm text-neutral-500">We will use this for order updates and delivery.</p>
            </header>

            <section className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
              <div className="px-5 sm:px-6 py-4 border-b border-neutral-100 flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/[0.06] text-primary">
                  <MapPin className="w-4 h-4" aria-hidden />
                </div>
                <div>
                  <h2 className="font-body text-sm font-semibold text-neutral-900">Shipping address</h2>
                  <p className="text-xs text-neutral-500">All fields marked * are required</p>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                      Full name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleInputChange}
                      placeholder="As per ID / bank records"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                      Mobile number <span className="text-primary">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit number"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                      Pincode <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={shippingAddress.pincode}
                      onChange={handleInputChange}
                      placeholder="6 digits"
                      maxLength="6"
                      className={`${inputClass} ${pincodeWarning ? 'border-amber-300 bg-amber-50/50' : ''}`}
                      required
                    />
                    {pincodeWarning && (
                      <div className="mt-1.5 flex items-start gap-1.5 text-xs text-amber-800">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <span>{pincodeWarning}</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                      Flat, house no., building <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      name="line1"
                      value={shippingAddress.line1}
                      onChange={handleInputChange}
                      placeholder="Street, society, landmark"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                      Area, colony <span className="text-neutral-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      name="line2"
                      value={shippingAddress.line2}
                      onChange={handleInputChange}
                      placeholder="Additional address line"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                      City <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      placeholder="City / district"
                      className={`${inputClass} ${cityWarning ? 'border-amber-300 bg-amber-50/50' : ''}`}
                      required
                    />
                    {cityWarning && (
                      <div className="mt-1.5 flex items-start gap-1.5 text-xs text-amber-800">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <span>{cityWarning}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                      State <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
              <div className="flex items-start gap-2.5 min-w-[140px] flex-1">
                <Shield className="w-4 h-4 text-primary/80 flex-shrink-0 mt-0.5" aria-hidden />
                <div>
                  <p className="font-medium text-neutral-900">Safe payments</p>
                  <p className="text-xs text-neutral-500 leading-snug">Encrypted checkout via Razorpay.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 min-w-[140px] flex-1">
                <Truck className="w-4 h-4 text-primary/80 flex-shrink-0 mt-0.5" aria-hidden />
                <div>
                  <p className="font-medium text-neutral-900">Reliable delivery</p>
                  <p className="text-xs text-neutral-500 leading-snug">Dispatched with care; 2–5 business days.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order summary — sticky */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-6 bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-neutral-500" aria-hidden />
                  <span className="font-body text-sm font-semibold text-neutral-900">Price details</span>
                </div>
                <span className="text-xs text-neutral-500">
                  {items.length} item{items.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="px-5 py-4 max-h-[280px] overflow-y-auto border-b border-neutral-100">
                <ul className="divide-y divide-neutral-100">
                  {items.map((item) => (
                    <li key={item.productId} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="h-16 w-12 flex-shrink-0 rounded bg-neutral-100 border border-neutral-100 overflow-hidden">
                        {item.image ? (
                          <img src={imgUrl(item.image)} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-neutral-300">
                            <ShoppingBag className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 line-clamp-2 leading-snug">{item.name}</p>
                        {item.unit && <p className="text-xs text-neutral-500 mt-0.5">{item.unit}</p>}
                        <p className="text-xs text-neutral-500 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-neutral-900 tabular-nums flex-shrink-0">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-5 py-4 space-y-3 text-sm">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-neutral-900 tabular-nums">₹{Number(total || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery</span>
                  <span className="font-medium text-neutral-900 tabular-nums">
                    {calculatingShipping ? (
                      <span className="text-neutral-400 font-normal">…</span>
                    ) : (
                      <>
                        {'\u20B9'}
                        {deliveryCharge === 0 ? '0' : Number(deliveryCharge).toLocaleString('en-IN')}
                      </>
                    )}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-neutral-600">
                    <span>Discount</span>
                    <span className="font-medium text-emerald-700 tabular-nums">−₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-3 border-t border-neutral-100">
                  <span className="text-sm font-semibold text-neutral-900">Total</span>
                  <span className="text-lg font-bold text-primary tabular-nums">
                    ₹{Number(finalTotal || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {shippingAddress.state &&
                (shippingInfo.isLocal ||
                  (shippingInfo.nextFreeShippingThreshold != null && shippingInfo.nextFreeShippingThreshold > 0)) && (
                  <div className="px-5 pb-4 -mt-1">
                    <div className="rounded-md bg-neutral-50 border border-neutral-100 px-3 py-2.5 text-xs text-neutral-600">
                      {shippingInfo.isLocal && shippingInfo.localState && (
                        <p>
                          <span className="font-semibold text-neutral-800">Local delivery</span>
                          {` — delivering within ${shippingInfo.localState}.`}
                        </p>
                      )}
                      {!shippingInfo.isLocal &&
                        shippingInfo.nextFreeShippingThreshold != null &&
                        shippingInfo.nextFreeShippingThreshold > 0 &&
                        deliveryCharge > 0 && (
                          <p>
                            Add items worth ₹
                            {Number(shippingInfo.nextFreeShippingThreshold).toLocaleString('en-IN')} more for reduced
                            delivery on eligible orders.
                          </p>
                        )}
                    </div>
                  </div>
                )}

              <div className="px-5 pb-5">
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={loading || items.length === 0}
                  className="w-full rounded-md bg-primary text-white text-sm font-semibold py-3.5 px-4 hover:bg-primary-light transition-colors disabled:opacity-45 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 opacity-90" />
                      Pay securely
                    </>
                  )}
                </button>

                <p className="mt-3 text-center text-[11px] text-neutral-500 leading-relaxed">
                  UPI · Cards · Net banking · Wallets — choose in the next step
                </p>

                <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-center gap-2 text-neutral-400">
                  <Lock className="w-3 h-3" aria-hidden />
                  <span className="text-[11px]">Secured by</span>
                  <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="" className="h-3 opacity-70" />
                  <span className="text-[11px] font-medium text-neutral-600">Razorpay</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
