import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Tag, MessageCircle } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import useSettingsStore from '../store/useSettingsStore';
import { formatPrice, generateWhatsAppMessage } from '../lib/utils';
import { BASE_URL } from '../lib/api';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { settings } = useSettingsStore();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated()) {
      toast.error('Please login to add items to cart');
      navigate(`/login?redirect=/products/${product.slug}`);
      return;
    }
    const res = await addToCart(product.productId);
    if (res?.success) {
      toast.success(`${product.name} added to cart! 🌿`);
    } else {
      toast.error(res?.message || 'Failed to add to cart');
    }
  };

  const handleWhatsAppOrder = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = generateWhatsAppMessage(
      [{ name: product.name, unit: product.unit, price: product.price, quantity: 1 }],
      settings.whatsappNumber
    );
    window.open(url, '_blank');
  };

  const discount = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  return (
    <Link to={`/products/${product.slug}`} className="card group block h-full flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-cream flex-shrink-0">
        {product.images?.[0] ? (
          <img
            src={`${BASE_URL}${product.images[0]}`}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cream to-cream-dark">
            <span className="text-4xl">🌿</span>
          </div>
        )}
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
            <Tag className="w-3 h-3" /> {discount}% OFF
          </div>
        )}
        {product.isFeatured && (
          <div className="absolute top-2 right-2 bg-accent text-primary-dark text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
            <Star className="w-3 h-3" fill="currentColor" /> Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs text-accent-dark font-medium mb-1 uppercase tracking-wide flex-shrink-0">{product.unit}</p>
        <h3 className="font-heading font-semibold text-text-primary text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors flex-shrink-0">
          {product.name}
        </h3>
        <p className="text-text-secondary text-sm line-clamp-2 mb-3 flex-grow">{product.description}</p>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-primary font-bold text-xl">{formatPrice(product.price)}</span>
            {product.mrp > product.price && (
              <span className="text-text-light line-through text-sm ml-2">{formatPrice(product.mrp)}</span>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-4 flex-shrink-0">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-semibold text-xs transition-all duration-200 ${
              product.stock === 0
                ? 'bg-muted text-text-light cursor-not-allowed'
                : 'bg-primary text-cream hover:bg-primary-light shadow-warm hover:shadow-md transform hover:-translate-y-0.5'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {product.stock === 0 ? 'Out of Stock' : 'Cart'}
          </button>
          
          <button
            onClick={handleWhatsAppOrder}
            disabled={product.stock === 0}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-semibold text-xs transition-all duration-200 ${
              product.stock === 0
                ? 'bg-muted text-text-light cursor-not-allowed'
                : 'bg-[#25D366] text-white hover:bg-[#128C7E] shadow-md transform hover:-translate-y-0.5'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </button>
        </div>
      </div>
    </Link>
  );
}
