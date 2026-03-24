import { X, ShoppingCart, Plus, Minus, Trash2, MessageCircle } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useSettingsStore from '../store/useSettingsStore';
import { formatPrice, generateWhatsAppMessage } from '../lib/utils';
import { BASE_URL, imgUrl } from '../lib/api';

export default function CartDrawer() {
  const { items, isOpen, setOpen, updateQuantity, removeItem, getTotal } = useCartStore();
  const { settings } = useSettingsStore();

  const handleWhatsApp = () => {
    if (items.length === 0) return;
    const url = generateWhatsAppMessage(items, settings.whatsappNumber);
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm z-50 bg-white shadow-2xl flex flex-col animate-slide-down">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-primary text-cream">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-accent" />
            <h2 className="font-heading text-lg font-semibold">Your Cart</h2>
            <span className="badge bg-accent text-primary-dark text-xs">{items.length}</span>
          </div>
          <button onClick={() => setOpen(false)} className="p-1 hover:bg-cream/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="font-heading text-xl text-primary font-semibold mb-2">Your cart is empty</p>
              <p className="text-text-secondary text-sm">Add some satvik goodness to your cart!</p>
              <button
                onClick={() => setOpen(false)}
                className="btn-primary mt-6 text-sm py-2 px-5"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.productId} className="flex gap-3 p-3 bg-cream rounded-lg border border-border">
                  {item.image ? (
                    <img
                      src={imgUrl(item.image)}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
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
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1.5 hover:bg-primary/10 hover:text-primary rounded-l-lg transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-sm font-semibold text-text-primary min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1.5 hover:bg-primary/10 hover:text-primary rounded-r-lg transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
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
          <div className="border-t border-border p-5 space-y-3 bg-cream/50">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-text-secondary">Total Amount</span>
              <span className="font-heading text-2xl font-bold text-primary">{formatPrice(getTotal())}</span>
            </div>
            <button
              onClick={handleWhatsApp}
              className="w-full btn-gold flex items-center justify-center gap-2 py-3"
            >
              <MessageCircle className="w-5 h-5" />
              Order via WhatsApp
            </button>
            <p className="text-xs text-text-light text-center">
              📱 You'll be redirected to WhatsApp with your order details
            </p>
          </div>
        )}
      </div>
    </>
  );
}
