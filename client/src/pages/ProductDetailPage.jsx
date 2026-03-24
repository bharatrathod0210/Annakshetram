import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, MessageCircle, Check, ChevronLeft, Minus, Plus, Leaf } from 'lucide-react';
import api, { BASE_URL, imgUrl } from '../lib/api';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import useSettingsStore from '../store/useSettingsStore';
import { formatPrice, generateWhatsAppMessage } from '../lib/utils';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { addToCart, isLoading: cartLoading } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { settings } = useSettingsStore();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        setProduct(res.data.data.product);
      } catch {
        navigate('/products');
      }
      setLoading(false);
    };
    fetch();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      toast.error('Please login to add items to cart');
      navigate(`/login?redirect=/products/${slug}`);
      return;
    }
    const res = await addToCart(product.productId, quantity);
    if (res?.success) {
      toast.success(`Added ${quantity} × ${product.name} to cart! 🌿`);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }
  };

  const handleWhatsApp = () => {
    const url = generateWhatsAppMessage(
      [{ name: product.name, unit: product.unit, price: product.price, quantity }],
      settings.whatsappNumber
    );
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square bg-muted rounded-lg" />
            <div className="space-y-4">
              <div className="h-6 bg-muted rounded w-1/4" />
              <div className="h-10 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-12 bg-muted rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discount = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="container-custom">
        <nav className="flex items-center gap-2 text-sm text-text-secondary mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary">Products</Link>
          <span>/</span>
          <span className="text-primary font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-card mb-4">
              {product.images?.[selectedImage] ? (
                <img src={imgUrl(product.images[selectedImage])} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-cream">
                  <span className="text-8xl">🌿</span>
                </div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${i === selectedImage ? 'border-primary' : 'border-border'}`}
                  >
                    <img src={imgUrl(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {product.isFeatured && <span className="badge-gold mb-3 inline-flex">⭐ Bestseller</span>}
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-2">{product.name}</h1>
            <p className="text-text-secondary mb-4">{product.unit} | {product.description}</p>

            <div className="flex items-center gap-4 mb-6">
              <span className="font-heading text-4xl font-bold text-primary">{formatPrice(product.price)}</span>
              {product.mrp > product.price && (
                <>
                  <span className="text-text-light line-through text-xl">{formatPrice(product.mrp)}</span>
                  <span className="badge-primary text-sm">Save {discount}%</span>
                </>
              )}
            </div>

            <div className={`flex items-center gap-2 mb-6 text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </div>

            {product.stock > 0 && (
              <div className="mb-6">
                <p className="font-medium text-text-primary mb-2 text-sm">Quantity</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-border rounded-lg bg-white overflow-hidden">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 hover:bg-muted transition-colors text-text-secondary">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 font-semibold text-text-primary min-w-[48px] text-center">{quantity}</span>
                    <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="p-3 hover:bg-muted transition-colors text-text-secondary">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-text-light text-sm">Total: {formatPrice(product.price * quantity)}</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || cartLoading}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-lg font-bold text-sm transition-all duration-200 ${
                  added ? 'bg-green-600 text-white'
                  : product.stock === 0 ? 'bg-muted text-text-light cursor-not-allowed'
                  : 'bg-primary text-cream hover:bg-primary-light shadow-warm hover:shadow-md'
                }`}
              >
                {added ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                {added ? 'Added to Cart!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                onClick={handleWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-lg font-bold text-sm bg-green-500 text-white hover:bg-green-600 transition-all shadow-md"
              >
                <MessageCircle className="w-5 h-5" />
                Order via WhatsApp
              </button>
            </div>

            {product.longDescription && (
              <div className="bg-white rounded-lg p-6 border border-border">
                <h2 className="font-heading text-xl font-semibold text-primary mb-3 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-accent" /> About this Product
                </h2>
                <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">{product.longDescription}</p>
              </div>
            )}

            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {product.tags.map(tag => <span key={tag} className="badge-primary">{tag}</span>)}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors text-sm">
            <ChevronLeft className="w-4 h-4" /> Back to Products
          </button>
        </div>
      </div>
    </div>
  );
}
