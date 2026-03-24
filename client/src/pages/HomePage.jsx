import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Leaf, Shield, Award, Truck, ChevronRight, Star, MessageCircle } from 'lucide-react';
import api from '../lib/api';
import useSettingsStore from '../store/useSettingsStore';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const { settings } = useSettingsStore();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, catRes] = await Promise.all([
          api.get('/products?featured=true&limit=6'),
          api.get('/categories'),
        ]);
        setFeaturedProducts(productRes.data.data.products);
        setCategories(catRes.data.data.categories);
      } catch {}
    };
    fetchData();
  }, []);

  const observerRef = useRef(null);
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, [featuredProducts, categories]);

  const features = [
    { icon: Leaf, title: 'Satvik & Organic', desc: 'Grown without chemicals, processed without preservatives.' },
    { icon: Shield, title: 'Quality Assured', desc: 'Every product undergoes strict quality checks.' },
    { icon: Award, title: 'Traditional Methods', desc: 'Ancient techniques for authentic taste and nutrition.' },
    { icon: Truck, title: 'Fresh Delivery', desc: 'Direct from farm to your doorstep, always fresh.' },
  ];

  const testimonials = [
    { name: 'Priya R.', text: 'The Ragi Malt is truly exceptional — light, nutritious, and filling. My whole family loves it!', rating: 5, location: 'Bangalore' },
    { name: 'Suresh M.', text: 'Godhi Hurihittu tastes exactly like what my grandmother used to make. Absolutely divine.', rating: 5, location: 'Mysore' },
    { name: 'Kavitha N.', text: 'The Kids Protein Mix is a blessing. My children love it and it keeps them energized all day!', rating: 5, location: 'Hubli' },
  ];

  const whatsappHref = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hello Annakshetram! I'd like to place an order.")}`;
  const categoryEmojis = ['🌾', '🌿', '🫙', '🌶️', '🍯'];

  return (
    <div>
      {/* HERO */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ backgroundImage: "url('/hero-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/95 via-primary/88 to-[#2B0606]/85" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="particle" style={{ width: `${8 + i * 4}px`, height: `${8 + i * 4}px`, top: `${10 + i * 10}%`, left: `${5 + i * 11}%`, animationDelay: `${i * 0.8}s`, animationDuration: `${5 + i}s` }} />
          ))}
        </div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-float-slow pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-primary-light/15 blur-3xl animate-float pointer-events-none" />

        <div className="container-custom relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-accent/15 text-accent border border-accent/40 rounded-lg px-5 py-2 text-sm font-semibold mb-8 hover-glow cursor-default">
                <Leaf className="w-4 h-4" /><span>Satvik Certified - 100% Organic</span>
              </div>
              <h1 className="font-heading font-bold text-cream leading-tight mb-6">
                <span className="block text-5xl md:text-6xl lg:text-7xl">Pure. Natural.</span>
                <span className="block text-5xl md:text-6xl lg:text-7xl text-gradient-gold">Satvik.</span>
              </h1>
              <p className="text-cream/80 text-lg md:text-xl mb-10 leading-relaxed max-w-xl">
                Satvikam Jeevanam, Shuddham Bhojanam - embrace the ancient wisdom of pure, wholesome eating that nourishes body and soul.
              </p>
              <div className="flex flex-wrap gap-4 mb-12">
                <Link to="/products" className="btn-gold flex items-center gap-2 text-base px-8 py-4">
                  <ShoppingBag className="w-5 h-5" /> Shop Now
                </Link>
                <a href={whatsappHref} target="_blank" rel="noreferrer"
                  className="wa-pulse bg-[#25D366] hover:bg-[#128C7E] text-white font-bold px-8 py-4 rounded-lg transition-all duration-300 flex items-center gap-2 text-base">
                  <MessageCircle className="w-5 h-5" /> Order on WhatsApp
                </a>
                <Link to="/about" className="border-2 border-cream/40 text-cream hover:border-accent hover:text-accent font-semibold px-8 py-4 rounded-lg transition-all duration-300 flex items-center gap-2">
                  Our Story <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex items-center gap-8">
                {[['500+', 'Happy Families'], ['100%', 'Organic'], ['0', 'Preservatives']].map(([num, label]) => (
                  <div key={label} className="text-center">
                    <p className="font-heading text-3xl font-bold text-gradient-gold">{num}</p>
                    <p className="text-cream/60 text-xs mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex flex-col items-center gap-4 animate-fade-in">
              <div className="glass rounded-lg p-8 text-center animate-float shadow-glow-lg border border-accent/30">
                <div className="text-7xl mb-4">🌿</div>
                <p className="font-heading text-2xl font-bold text-cream">Annakshetram</p>
                <p className="text-accent text-sm mt-1">Farm to Table - Since 2019</p>
              </div>
              <div className="flex gap-4">
                <div className="glass rounded-lg p-4 flex items-center gap-3 animate-float-slow" style={{ animationDelay: '1s' }}>
                  <span className="text-3xl">🌾</span>
                  <div><p className="font-semibold text-cream text-sm">Ragi Products</p><p className="text-accent/80 text-xs">Calcium-Rich</p></div>
                </div>
                <div className="glass rounded-lg p-4 flex items-center gap-3 animate-float-slow" style={{ animationDelay: '2s' }}>
                  <span className="text-3xl">🏆</span>
                  <div><p className="font-semibold text-cream text-sm">Premium Grade</p><p className="text-accent/80 text-xs">Lab Tested</p></div>
                </div>
              </div>
              <div className="glass rounded-lg p-4 flex items-center gap-4 animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div><p className="font-semibold text-cream text-sm">Order in Seconds</p><p className="text-accent/80 text-xs">Direct WhatsApp Ordering</p></div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <p className="text-cream/50 text-xs tracking-widest uppercase">Scroll</p>
          <div className="w-5 h-8 border-2 border-cream/30 rounded-lg flex items-start justify-center pt-1">
            <div className="w-1 h-2 bg-accent rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* FEATURES STRIP */}
      <section className="bg-white border-b border-border shadow-sm">
        <div className="container-custom py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="reveal flex items-start gap-4 group" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-cream transition-all duration-300 group-hover:-translate-y-1">
                  <Icon className="w-5 h-5 text-primary group-hover:text-cream transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary text-sm mb-1">{title}</h3>
                  <p className="text-text-light text-xs leading-relaxed hidden md:block">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section className="py-20 bg-cream">
          <div className="container-custom">
            <div className="text-center mb-14 reveal">
              <div className="ornament mb-3"><span className="text-accent text-sm">+</span></div>
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-subtitle">Discover our range of pure, traditional products</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {categories.map((cat, i) => (
                <Link key={cat.categoryId} to={`/products?category=${cat.categoryId}`} className="group reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="card-hover relative overflow-hidden aspect-square">
                    {cat.image ? (
                      <img src={`http://localhost:5000${cat.image}`} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/5 to-accent/10 flex flex-col items-center justify-center gap-2">
                        <span className="text-4xl">{categoryEmojis[i % categoryEmojis.length]}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
                    <div className="absolute inset-0 flex items-end p-4">
                      <div>
                        <p className="font-heading font-bold text-white text-sm">{cat.name}</p>
                        <p className="text-accent text-xs mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">Shop Now</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FEATURED PRODUCTS */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-14">
              <div className="reveal">
                <div className="ornament mb-3"><span className="text-accent text-sm">+</span></div>
                <h2 className="section-title">Our Bestsellers</h2>
                <p className="text-text-secondary">Loved by hundreds of families across India</p>
              </div>
              <Link to="/products" className="btn-outline text-sm hidden md:flex items-center gap-1 reveal">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, i) => (
                <div key={product.productId} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            <div className="text-center mt-10 md:hidden">
              <Link to="/products" className="btn-outline">View All Products</Link>
            </div>
          </div>
        </section>
      )}

      {/* WHY US */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #6B1414 0%, #8B1A1A 40%, #5a0f0f 100%)' }}>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #C9A84C, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #C9A84C, transparent)' }} />

        <div className="container-custom relative z-10">
          <div className="text-center mb-14 reveal">
            <div className="ornament mb-3"><span className="text-accent text-sm">+</span></div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-cream mb-3">
              Why Choose <span className="text-gradient-gold">Annakshetram?</span>
            </h2>
            <p className="text-cream/60 text-lg max-w-xl mx-auto">Pure food, honest farming, and generations of trust</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 reveal">
              {[
                ['🌾', 'Farmer Direct', 'We work directly with organic farmers, ensuring fair prices and fresh produce.'],
                ['🔬', 'Lab Tested', 'Every batch is tested for purity - zero adulterants reach your family.'],
                ['📦', 'Eco Packaging', 'Sustainable, minimal packaging that respects our planet.'],
                ['💚', 'Health First', 'No artificial additives, colors, or preservatives - ever.'],
              ].map(([emoji, title, desc]) => (
                <div key={title} className="rounded-lg p-5 border border-white/10 hover:border-accent/40 transition-all group" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="text-3xl mb-3">{emoji}</div>
                  <p className="font-semibold text-accent mb-1 text-sm">{title}</p>
                  <p className="text-cream/65 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-5 reveal">
              {[
                ['🌿', '100%', 'Organic Certified'],
                ['🏅', '5+', 'Years of Trust'],
                ['👨‍👩‍👧', '500+', 'Families Served'],
                ['🌱', '0', 'Preservatives'],
              ].map(([emoji, num, label]) => (
                <div key={label} className="rounded-lg p-6 text-center border border-white/10 hover:border-accent/50 transition-all duration-300 group" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <p className="text-3xl mb-3">{emoji}</p>
                  <p className="font-heading text-4xl font-bold text-gradient-gold mb-1">{num}</p>
                  <p className="text-cream/65 text-xs">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-cream-dark">
        <div className="container-custom">
          <div className="text-center mb-14 reveal">
            <div className="ornament mb-3"><span className="text-accent text-sm">+</span></div>
            <h2 className="section-title">What Our Families Say</h2>
            <p className="section-subtitle">Real experiences from real people</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={t.name} className="card p-6 hover:-translate-y-2 transition-all duration-300 reveal" style={{ transitionDelay: `${i * 120}ms` }}>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-accent" fill="currentColor" />)}
                </div>
                <p className="text-text-secondary text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 border-t border-border pt-4">
                  <div className="w-10 h-10 bg-gradient-maroon rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary text-sm">{t.name}</p>
                    <p className="text-text-light text-xs">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-cream">
        <div className="container-custom">
          <div className="relative rounded-lg overflow-hidden shadow-warm-lg reveal" style={{ background: 'linear-gradient(135deg, #6B1414 0%, #8B1A1A 50%, #A8883A 100%)' }}>
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #E0BE7A, transparent)' }} />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #E0BE7A, transparent)' }} />
            <div className="relative z-10 p-12 md:p-16 text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 text-accent border border-accent/30 rounded-lg px-5 py-2 text-sm font-semibold mb-8">
                <Leaf className="w-4 h-4" /> Start Your Satvik Journey Today
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">Ready to Experience</h2>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-gradient-gold mb-6">Pure Satvik Living?</h2>
              <p className="text-white/75 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                Join hundreds of families who have transformed their health with our pure, traditional products crafted with generations of wisdom.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/products" className="btn-gold flex items-center gap-2 px-10 py-4 text-base">
                  <ShoppingBag className="w-5 h-5" /> Shop Now
                </Link>
                <a href={whatsappHref} target="_blank" rel="noreferrer"
                  className="wa-pulse bg-[#25D366] hover:bg-[#128C7E] text-white font-bold px-10 py-4 rounded-lg transition-all duration-300 flex items-center gap-2 text-base">
                  <MessageCircle className="w-5 h-5" /> Order on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
