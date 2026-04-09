import { useState } from 'react';
import { X, ShoppingCart, Plus, Minus, Trash2, MessageCircle, MapPin, Pencil, Check, ChevronRight } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useSettingsStore from '../store/useSettingsStore';
import useAuthStore from '../store/useAuthStore';
import { formatPrice, generateWhatsAppMessage } from '../lib/utils';
import { imgUrl } from '../lib/api';
import api from '../lib/api';
import toast from 'react-hot-toast';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
];

const emptyAddr = { fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' };

export default function CartDrawer() {
  const { items, isOpen, setOpen, updateQuantity, removeItem, getTotal } = useCartStore();
  const { settings } = useSettingsStore();
  const { user, updateUser } = useAuthStore();

  const [step, setStep] = useState('cart'); // cart | address
  const [addrForm, setAddrForm] = useState(emptyAddr);
  const [saving, setSaving] = useState(false);

  const savedAddr = user?.address?.line1 ? user.address : null;

  const openAddress = () => {
    setAddrForm(savedAddr || emptyAddr);
    setStep('address');
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const { fullName, phone, line1, city, state, pincode } = addrForm;
    if (!fullName || !phone || !line1 || !city || !state || !pincode)
      return toast.error('Please fill all required fields');
    setSaving(true);
    try {
      const res = await api.put('/auth/address', addrForm);
      updateUser(res.data.data.user);
      toast.success('Address saved');
      setStep('cart');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save address');
    }
    setSaving(false);
  };

  const handleWhatsApp = () => {
    if (items.length === 0) return;
    if (!savedAddr) {
      toast.error('Please add a delivery address first');
      setAddrForm(emptyAddr);
      setStep('address');
      return;
    }
    const url = generateWhatsAppMessage(items, settings.whatsappNumber, savedAddr);
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => { setOpen(false); setStep('cart'); }} />

      <div className="fixed right-0 top-0 h-full w-full max-w-sm z-50 bg-white shadow-2xl flex flex-col animate-slide-down">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-primary text-cream flex-shrink-0">
          {step === 'address' ? (
            <>
              <button onClick={() => setStep('cart')} className="flex items-center gap-2 text-cream/80 hover:text-cream text-sm">
                <ChevronRight className="w-4 h-4 rotate-180" /> Back
              </button>
              <h2 className="font-heading text-lg font-semibold">Delivery Address</h2>
              <div className="w-16" />
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-accent" />
                <h2 className="font-heading text-lg font-semibold">Your Cart</h2>
                <span className="bg-accent text-primary-dark text-xs font-bold px-1.5 py-0.5 rounded-full">{items.length}</span>
              </div>
              <button onClick={() => { setOpen(false); setStep('cart'); }} className="p-1 hover:bg-cream/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Address Form */}
        {step === 'address' && (
          <form onSubmit={handleSaveAddress} className="flex-1 overflow-y-auto p-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
                <input value={addrForm.fullName} onChange={e => setAddrForm({ ...addrForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Recipient name" required />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Phone *</label>
                <input value={addrForm.phone} onChange={e => setAddrForm({ ...addrForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="+91 XXXXX XXXXX" required />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Address Line 1 *</label>
                <input value={addrForm.line1} onChange={e => setAddrForm({ ...addrForm, line1: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="House no, Street, Area" required />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Address Line 2</label>
                <input value={addrForm.line2} onChange={e => setAddrForm({ ...addrForm, line2: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Landmark (optional)" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">City *</label>
                <input value={addrForm.city} onChange={e => setAddrForm({ ...addrForm, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="City" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Pincode *</label>
                <input value={addrForm.pincode} onChange={e => setAddrForm({ ...addrForm, pincode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="560001" required />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">State *</label>
                <select value={addrForm.state} onChange={e => setAddrForm({ ...addrForm, state: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white" required>
                  <option value="">Select state</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-primary text-cream py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 mt-2">
              <Check className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Address'}
            </button>
          </form>
        )}

        {/* Cart Items */}
        {step === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto py-4 px-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="font-heading text-xl text-primary font-semibold mb-2">Your cart is empty</p>
                  <p className="text-text-secondary text-sm">Add some satvik goodness!</p>
                  <button onClick={() => setOpen(false)} className="btn-primary mt-6 text-sm py-2 px-5">Browse Products</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.productId} className="flex gap-3 p-3 bg-cream rounded-lg border border-border">
                      {item.image ? (
                        <img src={imgUrl(item.image)} alt={item.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                      ) : (
                        <div className="w-16 h-16 bg-cream-dark rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">🌿</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text-primary text-sm line-clamp-1">{item.name}</p>
                        <p className="text-xs text-text-light mb-2">{item.unit}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 bg-white border border-border rounded-lg">
                            <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="p-1.5 hover:bg-primary/10 hover:text-primary rounded-l-lg transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-sm font-semibold text-text-primary min-w-[24px] text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="p-1.5 hover:bg-primary/10 hover:text-primary rounded-r-lg transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button onClick={() => removeItem(item.productId)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-primary text-sm">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-5 space-y-3 bg-cream/50 flex-shrink-0">
                {/* Address block */}
                {savedAddr ? (
                  <div className="flex items-start gap-2 bg-white border border-border rounded-xl p-3">
                    <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-700">{savedAddr.fullName}</p>
                      <p className="text-xs text-gray-500 truncate">{savedAddr.line1}, {savedAddr.city} - {savedAddr.pincode}</p>
                    </div>
                    <button onClick={openAddress} className="text-primary hover:text-primary/70 flex-shrink-0">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button onClick={openAddress}
                    className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-primary/30 text-primary/70 hover:border-primary hover:text-primary rounded-xl py-2.5 text-sm font-medium transition-colors">
                    <MapPin className="w-4 h-4" /> Add Delivery Address
                  </button>
                )}

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-text-secondary">Total Amount</span>
                  <span className="font-heading text-2xl font-bold text-primary">{formatPrice(getTotal())}</span>
                </div>
                <button onClick={handleWhatsApp}
                  className="w-full btn-gold flex items-center justify-center gap-2 py-3">
                  <MessageCircle className="w-5 h-5" />
                  Order via WhatsApp
                </button>
                <p className="text-xs text-text-light text-center">
                  📱 You'll be redirected to WhatsApp with your order details
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
