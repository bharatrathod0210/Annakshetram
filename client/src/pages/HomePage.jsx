import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Leaf, Shield, Award, Truck, ChevronRight, Star, MessageCircle } from 'lucide-react';
import api, { imgUrl } from '../lib/api';
import useSettingsStore from '../store/useSettingsStore';
import ProductCard from '../components/ProductCard';

import heroBg from '../assets/hero-bg.png';

export default function HomePage() {
  const { settings } = useSettingsStore();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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
      finally { setLoading(false); }
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
        style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/75 via-primary/65 to-[#2B0606]/70" />
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
                  <div><p className="font-semibold text-cream text-sm">Premium Grade</p></div>
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
      {(loading || categories.length > 0) && (
        <section className="py-20 bg-cream relative overflow-hidden">
          <div className="container-custom relative z-10">
            <div className="text-center mb-14 reveal">
              <div className="ornament mb-3"><span className="text-accent text-sm">✦</span></div>
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-subtitle">Discover our range of pure, traditional products</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden relative">
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 animate-pulse" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="h-3 bg-primary/20 rounded animate-pulse w-3/4 mb-1" />
                      <div className="h-2 bg-primary/10 rounded animate-pulse w-1/2" />
                    </div>
                    {/* Shimmer overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer-sweep" style={{ animationDelay: `${i * 0.15}s` }} />
                  </div>
                ))
              ) : (
                categories.map((cat, i) => (
                  <Link key={cat.categoryId} to={`/products?category=${cat.categoryId}`} className="group reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                    <div className="card-hover relative overflow-hidden aspect-square">
                      {cat.image ? (
                        <img src={imgUrl(cat.image)} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* FEATURED PRODUCTS */}
      {(loading || featuredProducts.length > 0) && (
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-14 reveal">
              <div className="ornament mb-3"><span className="text-accent text-sm">✦</span></div>
              <h2 className="section-title">Our Bestsellers</h2>
              <p className="section-subtitle">Loved by hundreds of families across India</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-border bg-white shadow-sm">
                    {/* Image skeleton */}
                    <div className="relative h-56 bg-gradient-to-br from-primary/8 to-accent/8 animate-pulse overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer-sweep" style={{ animationDelay: `${i * 0.1}s` }} />
                      {/* Leaf icon placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                          <svg className="w-7 h-7 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3C7 3 3 7.5 3 12c0 2.5 1 4.8 2.7 6.4C7.2 19.8 9.5 21 12 21s4.8-1.2 6.3-2.6C20 16.8 21 14.5 21 12c0-4.5-4-9-9-9z"/></svg>
                        </div>
                      </div>
                      {/* Badge skeleton */}
                      <div className="absolute top-3 left-3 h-5 w-16 bg-accent/20 rounded-full animate-pulse" />
                    </div>
                    {/* Content skeleton */}
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-4/5" />
                      <div className="h-3 bg-gray-100 rounded animate-pulse w-3/5" />
                      <div className="flex items-center justify-between pt-1">
                        <div className="h-5 bg-accent/20 rounded animate-pulse w-1/4" />
                        <div className="h-8 w-8 bg-primary/10 rounded-lg animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                featuredProducts.map((product, i) => (
                  <div key={product.productId} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                    <ProductCard product={product} />
                  </div>
                ))
              )}
            </div>
            {!loading && (
              <div className="text-center mt-10 md:hidden">
                <Link to="/products" className="btn-outline">View All Products</Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* WHY US */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #6B1414 0%, #6B1414 40%, #5a0f0f 100%)' }}>
        {/* Animated golden design */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 600">
            <defs>
              <radialGradient id="rg1_wh" cx="15%" cy="15%" r="45%">
                <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.22"/>
                <stop offset="100%" stopColor="#C9A84C" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="rg2_wh" cx="85%" cy="85%" r="45%">
                <stop offset="0%" stopColor="#E0BE7A" stopOpacity="0.18"/>
                <stop offset="100%" stopColor="#E0BE7A" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="rg3_wh" cx="85%" cy="15%" r="35%">
                <stop offset="0%" stopColor="#A8883A" stopOpacity="0.12"/>
                <stop offset="100%" stopColor="#A8883A" stopOpacity="0"/>
              </radialGradient>
            </defs>
            {/* Glow blobs */}
            <rect width="100%" height="100%" fill={`url(#rg1_wh)`}/>
            <rect width="100%" height="100%" fill={`url(#rg2_wh)`}/>
            <rect width="100%" height="100%" fill={`url(#rg3_wh)`}/>
            {/* Top border */}
            <line x1="0" y1="1" x2="100%" y2="1" stroke="#C9A84C" strokeWidth="1.5" strokeOpacity="0.5"/>
            <line x1="0" y1="4" x2="100%" y2="4" stroke="#E0BE7A" strokeWidth="0.4" strokeOpacity="0.3"/>
            {/* Bottom border */}
            <line x1="0" y1="99%" x2="100%" y2="99%" stroke="#C9A84C" strokeWidth="1.5" strokeOpacity="0.5"/>
            <line x1="0" y1="96%" x2="100%" y2="96%" stroke="#E0BE7A" strokeWidth="0.4" strokeOpacity="0.3"/>
            {/* TL corner arcs */}
            <g opacity="0.45">
              <path d="M0,0 Q80,0 80,80" fill="none" stroke="#C9A84C" strokeWidth="1.2"/>
              <path d="M0,0 Q52,0 52,52" fill="none" stroke="#E0BE7A" strokeWidth="0.7"/>
              <path d="M0,0 Q28,0 28,28" fill="none" stroke="#C9A84C" strokeWidth="0.4"/>
              <circle cx="0" cy="0" r="5" fill="none" stroke="#C9A84C" strokeWidth="1"/>
              <circle cx="0" cy="0" r="2" fill="#C9A84C" fillOpacity="0.5"/>
            </g>
            {/* TR corner arcs */}
            <g opacity="0.45" transform="translate(100%,0) scale(-1,1)">
              <path d="M0,0 Q80,0 80,80" fill="none" stroke="#C9A84C" strokeWidth="1.2"/>
              <path d="M0,0 Q52,0 52,52" fill="none" stroke="#E0BE7A" strokeWidth="0.7"/>
              <path d="M0,0 Q28,0 28,28" fill="none" stroke="#C9A84C" strokeWidth="0.4"/>
              <circle cx="0" cy="0" r="5" fill="none" stroke="#C9A84C" strokeWidth="1"/>
              <circle cx="0" cy="0" r="2" fill="#C9A84C" fillOpacity="0.5"/>
            </g>
            {/* BL corner arcs */}
            <g opacity="0.45" transform="translate(0,100%) scale(1,-1)">
              <path d="M0,0 Q80,0 80,80" fill="none" stroke="#C9A84C" strokeWidth="1.2"/>
              <path d="M0,0 Q52,0 52,52" fill="none" stroke="#E0BE7A" strokeWidth="0.7"/>
              <path d="M0,0 Q28,0 28,28" fill="none" stroke="#C9A84C" strokeWidth="0.4"/>
              <circle cx="0" cy="0" r="5" fill="none" stroke="#C9A84C" strokeWidth="1"/>
              <circle cx="0" cy="0" r="2" fill="#C9A84C" fillOpacity="0.5"/>
            </g>
            {/* BR corner arcs */}
            <g opacity="0.45" transform="translate(100%,100%) scale(-1,-1)">
              <path d="M0,0 Q80,0 80,80" fill="none" stroke="#C9A84C" strokeWidth="1.2"/>
              <path d="M0,0 Q52,0 52,52" fill="none" stroke="#E0BE7A" strokeWidth="0.7"/>
              <path d="M0,0 Q28,0 28,28" fill="none" stroke="#C9A84C" strokeWidth="0.4"/>
              <circle cx="0" cy="0" r="5" fill="none" stroke="#C9A84C" strokeWidth="1"/>
              <circle cx="0" cy="0" r="2" fill="#C9A84C" fillOpacity="0.5"/>
            </g>
            {/* Animated floating dots */}
            <circle cx="20%" cy="25%" r="2" fill="#C9A84C" fillOpacity="0.25">
              <animate attributeName="cy" values="25%;22%;25%" dur="4s" repeatCount="indefinite"/>
              <animate attributeName="fillOpacity" values="0.25;0.5;0.25" dur="4s" repeatCount="indefinite"/>
            </circle>
            <circle cx="80%" cy="70%" r="1.5" fill="#E0BE7A" fillOpacity="0.2">
              <animate attributeName="cy" values="70%;67%;70%" dur="5s" repeatCount="indefinite"/>
              <animate attributeName="fillOpacity" values="0.2;0.45;0.2" dur="5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="50%" cy="15%" r="1.5" fill="#C9A84C" fillOpacity="0.2">
              <animate attributeName="cy" values="15%;12%;15%" dur="3.5s" repeatCount="indefinite"/>
              <animate attributeName="fillOpacity" values="0.2;0.4;0.2" dur="3.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="75%" cy="30%" r="1" fill="#E0BE7A" fillOpacity="0.18">
              <animate attributeName="cy" values="30%;27%;30%" dur="6s" repeatCount="indefinite"/>
            </circle>
            <circle cx="25%" cy="75%" r="1" fill="#C9A84C" fillOpacity="0.18">
              <animate attributeName="cy" values="75%;72%;75%" dur="4.5s" repeatCount="indefinite"/>
            </circle>
            {/* Animated shimmer line */}
            <line x1="-100%" y1="50%" x2="0%" y2="50%" stroke="#C9A84C" strokeWidth="0.5" strokeOpacity="0.3">
              <animate attributeName="x1" values="-100%;200%" dur="6s" repeatCount="indefinite"/>
              <animate attributeName="x2" values="0%;300%" dur="6s" repeatCount="indefinite"/>
            </line>
            {/* Center rotating diamond */}
            <g opacity="0.08" transform="translate(50%,50%)">
              <rect x="-90" y="-90" width="180" height="180" fill="none" stroke="#C9A84C" strokeWidth="0.8" transform="rotate(45)">
                <animateTransform attributeName="transform" type="rotate" from="45" to="405" dur="30s" repeatCount="indefinite"/>
              </rect>
              <rect x="-60" y="-60" width="120" height="120" fill="none" stroke="#E0BE7A" strokeWidth="0.5" transform="rotate(45)">
                <animateTransform attributeName="transform" type="rotate" from="45" to="-315" dur="20s" repeatCount="indefinite"/>
              </rect>
            </g>
            {/* Corner leaves */}
            <g opacity="0.35">
              {/* TL — 2 leaves, spread apart */}
              <g transform="translate(-5,0) rotate(-28)">
                <path fill="none" stroke="#E0BE7A" strokeWidth="1.5" d="M0,0 C8,-45 45,-68 60,-44 C45,-22 12,-5 0,0Z"/>
                <line stroke="#C9A84C" strokeWidth="0.7" x1="0" y1="0" x2="34" y2="-40"/>
                <line stroke="#C9A84C" strokeWidth="0.5" x1="12" y1="-14" x2="42" y2="-34"/>
              </g>
              <g transform="translate(55,-8) rotate(-6)">
                <path fill="none" stroke="#C9A84C" strokeWidth="1.2" d="M0,0 C6,-38 38,-56 50,-36 C38,-18 10,-4 0,0Z"/>
                <line stroke="#C9A84C" strokeWidth="0.6" x1="0" y1="0" x2="28" y2="-32"/>
              </g>
              {/* TR — 2 leaves, spread apart */}
              <g transform="translate(1205,0) rotate(208)">
                <path fill="none" stroke="#E0BE7A" strokeWidth="1.5" d="M0,0 C8,-45 45,-68 60,-44 C45,-22 12,-5 0,0Z"/>
                <line stroke="#C9A84C" strokeWidth="0.7" x1="0" y1="0" x2="34" y2="-40"/>
                <line stroke="#C9A84C" strokeWidth="0.5" x1="12" y1="-14" x2="42" y2="-34"/>
              </g>
              <g transform="translate(1145,-8) rotate(186)">
                <path fill="none" stroke="#C9A84C" strokeWidth="1.2" d="M0,0 C6,-38 38,-56 50,-36 C38,-18 10,-4 0,0Z"/>
                <line stroke="#C9A84C" strokeWidth="0.6" x1="0" y1="0" x2="28" y2="-32"/>
              </g>
              {/* BL — 2 leaves, spread apart */}
              <g transform="translate(-5,600) rotate(152)">
                <path fill="none" stroke="#E0BE7A" strokeWidth="1.5" d="M0,0 C8,-45 45,-68 60,-44 C45,-22 12,-5 0,0Z"/>
                <line stroke="#C9A84C" strokeWidth="0.7" x1="0" y1="0" x2="34" y2="-40"/>
                <line stroke="#C9A84C" strokeWidth="0.5" x1="12" y1="-14" x2="42" y2="-34"/>
              </g>
              <g transform="translate(55,608) rotate(174)">
                <path fill="none" stroke="#C9A84C" strokeWidth="1.2" d="M0,0 C6,-38 38,-56 50,-36 C38,-18 10,-4 0,0Z"/>
                <line stroke="#C9A84C" strokeWidth="0.6" x1="0" y1="0" x2="28" y2="-32"/>
              </g>
              {/* BR — 2 leaves, spread apart */}
              <g transform="translate(1205,600) rotate(-28)">
                <path fill="none" stroke="#E0BE7A" strokeWidth="1.5" d="M0,0 C8,-45 45,-68 60,-44 C45,-22 12,-5 0,0Z"/>
                <line stroke="#C9A84C" strokeWidth="0.7" x1="0" y1="0" x2="34" y2="-40"/>
                <line stroke="#C9A84C" strokeWidth="0.5" x1="12" y1="-14" x2="42" y2="-34"/>
              </g>
              <g transform="translate(1145,608) rotate(-6)">
                <path fill="none" stroke="#C9A84C" strokeWidth="1.2" d="M0,0 C6,-38 38,-56 50,-36 C38,-18 10,-4 0,0Z"/>
                <line stroke="#C9A84C" strokeWidth="0.6" x1="0" y1="0" x2="28" y2="-32"/>
              </g>
              {/* CENTER scattered — 4 leaves, well spaced, no overlap */}
              <g transform="translate(280,300) rotate(20)">
                <path fill="none" stroke="#E0BE7A" strokeWidth="1" d="M0,0 C5,-30 30,-45 40,-29 C30,-14 8,-3 0,0Z"/>
                <line stroke="#C9A84C" strokeWidth="0.5" x1="0" y1="0" x2="22" y2="-26"/>
              </g>
              <g transform="translate(920,300) rotate(-20)">
                <path fill="none" stroke="#C9A84C" strokeWidth="1" d="M0,0 C5,-30 30,-45 40,-29 C30,-14 8,-3 0,0Z"/>
                <line stroke="#C9A84C" strokeWidth="0.5" x1="0" y1="0" x2="22" y2="-26"/>
              </g>
              <g transform="translate(580,150) rotate(35)">
                <path fill="none" stroke="#E0BE7A" strokeWidth="0.9" d="M0,0 C4,-26 26,-38 34,-24 C26,-12 7,-3 0,0Z"/>
                <line stroke="#C9A84C" strokeWidth="0.4" x1="0" y1="0" x2="19" y2="-22"/>
              </g>
              <g transform="translate(620,450) rotate(-35)">
                <path fill="none" stroke="#C9A84C" strokeWidth="0.9" d="M0,0 C4,-26 26,-38 34,-24 C26,-12 7,-3 0,0Z"/>
                <line stroke="#C9A84C" strokeWidth="0.4" x1="0" y1="0" x2="19" y2="-22"/>
              </g>
            </g>
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #9b7513ff, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #9b7513ff, transparent)' }} />

        <div className="container-custom relative z-10">
          <div className="text-center mb-14 reveal">
            <div className="ornament mb-3"><span className="text-accent text-sm">✦</span></div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-cream mb-3">
              Why Choose <span className="text-gradient-gold">Annakshetram?</span>
            </h2>
            <p className="text-cream/60 text-lg max-w-xl mx-auto">Pure food, honest farming, and generations of trust</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 reveal">
              {[
                ['🌾', 'Farmer Direct', 'We work directly with organic farmers, ensuring fair prices and fresh produce.'],
                ['🌱', 'Chemical Free', 'Zero pesticides, zero chemicals — grown the way nature intended.'],
                ['�', 'Eco Packaging', 'Sustainable, minimal packaging that respects our planet.'],
                ['💚', 'Health First', 'No artificial additives, colors, or preservatives - ever.'],
              ].map(([emoji, title, desc]) => (
                <div key={title} className="rounded-xl p-5 border border-white/10 hover:border-accent/50 hover:-translate-y-1 transition-all duration-300 group" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-xl" style={{ background: 'rgba(201,168,76,0.15)' }}>{emoji}</div>
                  <p className="font-semibold text-accent mb-1 text-sm">{title}</p>
                  <p className="text-cream/60 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            {/* Right - Stats */}
            <div className="flex flex-col gap-4 reveal">
              <div className="rounded-xl p-6 border border-white/10 flex items-center gap-5" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="text-4xl">🌿</div>
                <div>
                  <p className="font-heading text-4xl font-bold text-gradient-gold">100%</p>
                  <p className="text-cream/65 text-sm mt-0.5">Organic Certified — every single product</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl p-5 border border-white/10 text-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <p className="text-3xl mb-2">🏅</p>
                  <p className="font-heading text-3xl font-bold text-gradient-gold">5+</p>
                  <p className="text-cream/60 text-xs mt-1">Years of Trust</p>
                </div>
                <div className="rounded-xl p-5 border border-white/10 text-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <p className="text-3xl mb-2">👨‍👩‍👧</p>
                  <p className="font-heading text-3xl font-bold text-gradient-gold">500+</p>
                  <p className="text-cream/60 text-xs mt-1">Families Served</p>
                </div>
              </div>
              <div className="rounded-xl p-6 border border-accent/30 flex items-center gap-5" style={{ background: 'rgba(201,168,76,0.08)' }}>
                <div className="text-4xl">🤝</div>
                <div>
                  <p className="font-heading text-4xl font-bold text-gradient-gold">0</p>
                  <p className="text-cream/65 text-sm mt-0.5">Preservatives — pure as nature</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-cream-dark relative overflow-hidden">
        {/* Animated golden design */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 600">
            <defs>
              <radialGradient id="rg1_tm" cx="15%" cy="15%" r="45%">
                <stop offset="0%" stopColor="#8B1A1A" stopOpacity="0.154"/>
                <stop offset="100%" stopColor="#8B1A1A" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="rg2_tm" cx="85%" cy="85%" r="45%">
                <stop offset="0%" stopColor="#6B1414" stopOpacity="0.126"/>
                <stop offset="100%" stopColor="#6B1414" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="rg3_tm" cx="85%" cy="15%" r="35%">
                <stop offset="0%" stopColor="#8B1A1A" stopOpacity="0.084"/>
                <stop offset="100%" stopColor="#8B1A1A" stopOpacity="0"/>
              </radialGradient>
            </defs>
            {/* Glow blobs */}
            <rect width="100%" height="100%" fill={`url(#rg1_tm)`}/>
            <rect width="100%" height="100%" fill={`url(#rg2_tm)`}/>
            <rect width="100%" height="100%" fill={`url(#rg3_tm)`}/>
            {/* Top border */}
            <line x1="0" y1="1" x2="100%" y2="1" stroke="#8B1A1A" strokeWidth="1.5" strokeOpacity="0.5"/>
            <line x1="0" y1="4" x2="100%" y2="4" stroke="#6B1414" strokeWidth="0.4" strokeOpacity="0.3"/>
            {/* Bottom border */}
            <line x1="0" y1="99%" x2="100%" y2="99%" stroke="#8B1A1A" strokeWidth="1.5" strokeOpacity="0.5"/>
            <line x1="0" y1="96%" x2="100%" y2="96%" stroke="#6B1414" strokeWidth="0.4" strokeOpacity="0.3"/>
            {/* TL corner arcs */}
            <g opacity="0.45">
              <path d="M0,0 Q80,0 80,80" fill="none" stroke="#8B1A1A" strokeWidth="1.2"/>
              <path d="M0,0 Q52,0 52,52" fill="none" stroke="#6B1414" strokeWidth="0.7"/>
              <path d="M0,0 Q28,0 28,28" fill="none" stroke="#8B1A1A" strokeWidth="0.4"/>
              <circle cx="0" cy="0" r="5" fill="none" stroke="#8B1A1A" strokeWidth="1"/>
              <circle cx="0" cy="0" r="2" fill="#8B1A1A" fillOpacity="0.5"/>
            </g>
            {/* TR corner arcs */}
            <g opacity="0.45" transform="translate(100%,0) scale(-1,1)">
              <path d="M0,0 Q80,0 80,80" fill="none" stroke="#8B1A1A" strokeWidth="1.2"/>
              <path d="M0,0 Q52,0 52,52" fill="none" stroke="#6B1414" strokeWidth="0.7"/>
              <path d="M0,0 Q28,0 28,28" fill="none" stroke="#8B1A1A" strokeWidth="0.4"/>
              <circle cx="0" cy="0" r="5" fill="none" stroke="#8B1A1A" strokeWidth="1"/>
              <circle cx="0" cy="0" r="2" fill="#8B1A1A" fillOpacity="0.5"/>
            </g>
            {/* BL corner arcs */}
            <g opacity="0.45" transform="translate(0,100%) scale(1,-1)">
              <path d="M0,0 Q80,0 80,80" fill="none" stroke="#8B1A1A" strokeWidth="1.2"/>
              <path d="M0,0 Q52,0 52,52" fill="none" stroke="#6B1414" strokeWidth="0.7"/>
              <path d="M0,0 Q28,0 28,28" fill="none" stroke="#8B1A1A" strokeWidth="0.4"/>
              <circle cx="0" cy="0" r="5" fill="none" stroke="#8B1A1A" strokeWidth="1"/>
              <circle cx="0" cy="0" r="2" fill="#8B1A1A" fillOpacity="0.5"/>
            </g>
            {/* BR corner arcs */}
            <g opacity="0.45" transform="translate(100%,100%) scale(-1,-1)">
              <path d="M0,0 Q80,0 80,80" fill="none" stroke="#8B1A1A" strokeWidth="1.2"/>
              <path d="M0,0 Q52,0 52,52" fill="none" stroke="#6B1414" strokeWidth="0.7"/>
              <path d="M0,0 Q28,0 28,28" fill="none" stroke="#8B1A1A" strokeWidth="0.4"/>
              <circle cx="0" cy="0" r="5" fill="none" stroke="#8B1A1A" strokeWidth="1"/>
              <circle cx="0" cy="0" r="2" fill="#8B1A1A" fillOpacity="0.5"/>
            </g>
            {/* Animated floating dots */}
            <circle cx="20%" cy="25%" r="2" fill="#8B1A1A" fillOpacity="0.25">
              <animate attributeName="cy" values="25%;22%;25%" dur="4s" repeatCount="indefinite"/>
              <animate attributeName="fillOpacity" values="0.25;0.5;0.25" dur="4s" repeatCount="indefinite"/>
            </circle>
            <circle cx="80%" cy="70%" r="1.5" fill="#6B1414" fillOpacity="0.2">
              <animate attributeName="cy" values="70%;67%;70%" dur="5s" repeatCount="indefinite"/>
              <animate attributeName="fillOpacity" values="0.2;0.45;0.2" dur="5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="50%" cy="15%" r="1.5" fill="#8B1A1A" fillOpacity="0.2">
              <animate attributeName="cy" values="15%;12%;15%" dur="3.5s" repeatCount="indefinite"/>
              <animate attributeName="fillOpacity" values="0.2;0.4;0.2" dur="3.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="75%" cy="30%" r="1" fill="#6B1414" fillOpacity="0.18">
              <animate attributeName="cy" values="30%;27%;30%" dur="6s" repeatCount="indefinite"/>
            </circle>
            <circle cx="25%" cy="75%" r="1" fill="#8B1A1A" fillOpacity="0.18">
              <animate attributeName="cy" values="75%;72%;75%" dur="4.5s" repeatCount="indefinite"/>
            </circle>
            {/* Animated shimmer line */}
            <line x1="-100%" y1="50%" x2="0%" y2="50%" stroke="#8B1A1A" strokeWidth="0.5" strokeOpacity="0.3">
              <animate attributeName="x1" values="-100%;200%" dur="6s" repeatCount="indefinite"/>
              <animate attributeName="x2" values="0%;300%" dur="6s" repeatCount="indefinite"/>
            </line>
            {/* Center rotating diamond */}
            <g opacity="0.08" transform="translate(50%,50%)">
              <rect x="-90" y="-90" width="180" height="180" fill="none" stroke="#8B1A1A" strokeWidth="0.8" transform="rotate(45)">
                <animateTransform attributeName="transform" type="rotate" from="45" to="405" dur="30s" repeatCount="indefinite"/>
              </rect>
              <rect x="-60" y="-60" width="120" height="120" fill="none" stroke="#6B1414" strokeWidth="0.5" transform="rotate(45)">
                <animateTransform attributeName="transform" type="rotate" from="45" to="-315" dur="20s" repeatCount="indefinite"/>
              </rect>
            </g>
            {/* Corner leaves */}
            <g opacity="0.25">
              {/* TL — 2 leaves, spread apart */}
              <g transform="translate(-5,0) rotate(-28)">
                <path fill="none" stroke="#8B1A1A" strokeWidth="1.5" d="M0,0 C8,-45 45,-68 60,-44 C45,-22 12,-5 0,0Z"/>
                <line stroke="#6B1414" strokeWidth="0.7" x1="0" y1="0" x2="34" y2="-40"/>
                <line stroke="#6B1414" strokeWidth="0.5" x1="12" y1="-14" x2="42" y2="-34"/>
              </g>
              <g transform="translate(55,-8) rotate(-6)">
                <path fill="none" stroke="#6B1414" strokeWidth="1.2" d="M0,0 C6,-38 38,-56 50,-36 C38,-18 10,-4 0,0Z"/>
                <line stroke="#6B1414" strokeWidth="0.6" x1="0" y1="0" x2="28" y2="-32"/>
              </g>
              {/* TR — 2 leaves, spread apart */}
              <g transform="translate(1205,0) rotate(208)">
                <path fill="none" stroke="#8B1A1A" strokeWidth="1.5" d="M0,0 C8,-45 45,-68 60,-44 C45,-22 12,-5 0,0Z"/>
                <line stroke="#6B1414" strokeWidth="0.7" x1="0" y1="0" x2="34" y2="-40"/>
                <line stroke="#6B1414" strokeWidth="0.5" x1="12" y1="-14" x2="42" y2="-34"/>
              </g>
              <g transform="translate(1145,-8) rotate(186)">
                <path fill="none" stroke="#6B1414" strokeWidth="1.2" d="M0,0 C6,-38 38,-56 50,-36 C38,-18 10,-4 0,0Z"/>
                <line stroke="#6B1414" strokeWidth="0.6" x1="0" y1="0" x2="28" y2="-32"/>
              </g>
              {/* BL — 2 leaves, spread apart */}
              <g transform="translate(-5,600) rotate(152)">
                <path fill="none" stroke="#8B1A1A" strokeWidth="1.5" d="M0,0 C8,-45 45,-68 60,-44 C45,-22 12,-5 0,0Z"/>
                <line stroke="#6B1414" strokeWidth="0.7" x1="0" y1="0" x2="34" y2="-40"/>
                <line stroke="#6B1414" strokeWidth="0.5" x1="12" y1="-14" x2="42" y2="-34"/>
              </g>
              <g transform="translate(55,608) rotate(174)">
                <path fill="none" stroke="#6B1414" strokeWidth="1.2" d="M0,0 C6,-38 38,-56 50,-36 C38,-18 10,-4 0,0Z"/>
                <line stroke="#6B1414" strokeWidth="0.6" x1="0" y1="0" x2="28" y2="-32"/>
              </g>
              {/* BR — 2 leaves, spread apart */}
              <g transform="translate(1205,600) rotate(-28)">
                <path fill="none" stroke="#8B1A1A" strokeWidth="1.5" d="M0,0 C8,-45 45,-68 60,-44 C45,-22 12,-5 0,0Z"/>
                <line stroke="#6B1414" strokeWidth="0.7" x1="0" y1="0" x2="34" y2="-40"/>
                <line stroke="#6B1414" strokeWidth="0.5" x1="12" y1="-14" x2="42" y2="-34"/>
              </g>
              <g transform="translate(1145,608) rotate(-6)">
                <path fill="none" stroke="#6B1414" strokeWidth="1.2" d="M0,0 C6,-38 38,-56 50,-36 C38,-18 10,-4 0,0Z"/>
                <line stroke="#6B1414" strokeWidth="0.6" x1="0" y1="0" x2="28" y2="-32"/>
              </g>
              {/* CENTER scattered — 4 leaves, well spaced, no overlap */}
              <g transform="translate(280,300) rotate(20)">
                <path fill="none" stroke="#8B1A1A" strokeWidth="1" d="M0,0 C5,-30 30,-45 40,-29 C30,-14 8,-3 0,0Z"/>
                <line stroke="#6B1414" strokeWidth="0.5" x1="0" y1="0" x2="22" y2="-26"/>
              </g>
              <g transform="translate(920,300) rotate(-20)">
                <path fill="none" stroke="#6B1414" strokeWidth="1" d="M0,0 C5,-30 30,-45 40,-29 C30,-14 8,-3 0,0Z"/>
                <line stroke="#6B1414" strokeWidth="0.5" x1="0" y1="0" x2="22" y2="-26"/>
              </g>
              <g transform="translate(580,150) rotate(35)">
                <path fill="none" stroke="#8B1A1A" strokeWidth="0.9" d="M0,0 C4,-26 26,-38 34,-24 C26,-12 7,-3 0,0Z"/>
                <line stroke="#6B1414" strokeWidth="0.4" x1="0" y1="0" x2="19" y2="-22"/>
              </g>
              <g transform="translate(620,450) rotate(-35)">
                <path fill="none" stroke="#6B1414" strokeWidth="0.9" d="M0,0 C4,-26 26,-38 34,-24 C26,-12 7,-3 0,0Z"/>
                <line stroke="#6B1414" strokeWidth="0.4" x1="0" y1="0" x2="19" y2="-22"/>
              </g>
            </g>
          </svg>
        </div>
        <div className="container-custom relative z-10">
          <div className="text-center mb-14 reveal">
            <div className="ornament mb-3"><span className="text-accent text-sm">✦</span></div>
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
          <div className="relative rounded-lg overflow-hidden shadow-warm-lg reveal" style={{ background: 'linear-gradient(135deg, #6B1414 0%, #6B1414 50%, #A8883A 100%)' }}>
            {/* Animated golden design */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 500">
                <defs>
                  <radialGradient id="rg1_cta" cx="15%" cy="15%" r="45%">
                    <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.22"/>
                    <stop offset="100%" stopColor="#C9A84C" stopOpacity="0"/>
                  </radialGradient>
                  <radialGradient id="rg2_cta" cx="85%" cy="85%" r="45%">
                    <stop offset="0%" stopColor="#E0BE7A" stopOpacity="0.18"/>
                    <stop offset="100%" stopColor="#E0BE7A" stopOpacity="0"/>
                  </radialGradient>
                  <radialGradient id="rg3_cta" cx="85%" cy="15%" r="35%">
                    <stop offset="0%" stopColor="#A8883A" stopOpacity="0.12"/>
                    <stop offset="100%" stopColor="#A8883A" stopOpacity="0"/>
                  </radialGradient>
                </defs>
                {/* Glow blobs */}
                <rect width="100%" height="100%" fill={`url(#rg1_cta)`}/>
                <rect width="100%" height="100%" fill={`url(#rg2_cta)`}/>
                <rect width="100%" height="100%" fill={`url(#rg3_cta)`}/>
                {/* Top border */}
                <line x1="0" y1="1" x2="100%" y2="1" stroke="#C9A84C" strokeWidth="1.5" strokeOpacity="0.5"/>
                <line x1="0" y1="4" x2="100%" y2="4" stroke="#E0BE7A" strokeWidth="0.4" strokeOpacity="0.3"/>
                {/* Bottom border */}
                <line x1="0" y1="99%" x2="100%" y2="99%" stroke="#C9A84C" strokeWidth="1.5" strokeOpacity="0.5"/>
                <line x1="0" y1="96%" x2="100%" y2="96%" stroke="#E0BE7A" strokeWidth="0.4" strokeOpacity="0.3"/>
                {/* TL corner arcs */}
                <g opacity="0.45">
                  <path d="M0,0 Q80,0 80,80" fill="none" stroke="#C9A84C" strokeWidth="1.2"/>
                  <path d="M0,0 Q52,0 52,52" fill="none" stroke="#E0BE7A" strokeWidth="0.7"/>
                  <path d="M0,0 Q28,0 28,28" fill="none" stroke="#C9A84C" strokeWidth="0.4"/>
                  <circle cx="0" cy="0" r="5" fill="none" stroke="#C9A84C" strokeWidth="1"/>
                  <circle cx="0" cy="0" r="2" fill="#C9A84C" fillOpacity="0.5"/>
                </g>
                {/* TR corner arcs */}
                <g opacity="0.45" transform="translate(100%,0) scale(-1,1)">
                  <path d="M0,0 Q80,0 80,80" fill="none" stroke="#C9A84C" strokeWidth="1.2"/>
                  <path d="M0,0 Q52,0 52,52" fill="none" stroke="#E0BE7A" strokeWidth="0.7"/>
                  <path d="M0,0 Q28,0 28,28" fill="none" stroke="#C9A84C" strokeWidth="0.4"/>
                  <circle cx="0" cy="0" r="5" fill="none" stroke="#C9A84C" strokeWidth="1"/>
                  <circle cx="0" cy="0" r="2" fill="#C9A84C" fillOpacity="0.5"/>
                </g>
                {/* BL corner arcs */}
                <g opacity="0.45" transform="translate(0,100%) scale(1,-1)">
                  <path d="M0,0 Q80,0 80,80" fill="none" stroke="#C9A84C" strokeWidth="1.2"/>
                  <path d="M0,0 Q52,0 52,52" fill="none" stroke="#E0BE7A" strokeWidth="0.7"/>
                  <path d="M0,0 Q28,0 28,28" fill="none" stroke="#C9A84C" strokeWidth="0.4"/>
                  <circle cx="0" cy="0" r="5" fill="none" stroke="#C9A84C" strokeWidth="1"/>
                  <circle cx="0" cy="0" r="2" fill="#C9A84C" fillOpacity="0.5"/>
                </g>
                {/* BR corner arcs */}
                <g opacity="0.45" transform="translate(100%,100%) scale(-1,-1)">
                  <path d="M0,0 Q80,0 80,80" fill="none" stroke="#C9A84C" strokeWidth="1.2"/>
                  <path d="M0,0 Q52,0 52,52" fill="none" stroke="#E0BE7A" strokeWidth="0.7"/>
                  <path d="M0,0 Q28,0 28,28" fill="none" stroke="#C9A84C" strokeWidth="0.4"/>
                  <circle cx="0" cy="0" r="5" fill="none" stroke="#C9A84C" strokeWidth="1"/>
                  <circle cx="0" cy="0" r="2" fill="#C9A84C" fillOpacity="0.5"/>
                </g>
                {/* Animated floating dots */}
                <circle cx="20%" cy="25%" r="2" fill="#C9A84C" fillOpacity="0.25">
                  <animate attributeName="cy" values="25%;22%;25%" dur="4s" repeatCount="indefinite"/>
                  <animate attributeName="fillOpacity" values="0.25;0.5;0.25" dur="4s" repeatCount="indefinite"/>
                </circle>
                <circle cx="80%" cy="70%" r="1.5" fill="#E0BE7A" fillOpacity="0.2">
                  <animate attributeName="cy" values="70%;67%;70%" dur="5s" repeatCount="indefinite"/>
                  <animate attributeName="fillOpacity" values="0.2;0.45;0.2" dur="5s" repeatCount="indefinite"/>
                </circle>
                <circle cx="50%" cy="15%" r="1.5" fill="#C9A84C" fillOpacity="0.2">
                  <animate attributeName="cy" values="15%;12%;15%" dur="3.5s" repeatCount="indefinite"/>
                  <animate attributeName="fillOpacity" values="0.2;0.4;0.2" dur="3.5s" repeatCount="indefinite"/>
                </circle>
                <circle cx="75%" cy="30%" r="1" fill="#E0BE7A" fillOpacity="0.18">
                  <animate attributeName="cy" values="30%;27%;30%" dur="6s" repeatCount="indefinite"/>
                </circle>
                <circle cx="25%" cy="75%" r="1" fill="#C9A84C" fillOpacity="0.18">
                  <animate attributeName="cy" values="75%;72%;75%" dur="4.5s" repeatCount="indefinite"/>
                </circle>
                {/* Animated shimmer line */}
                <line x1="-100%" y1="50%" x2="0%" y2="50%" stroke="#C9A84C" strokeWidth="0.5" strokeOpacity="0.3">
                  <animate attributeName="x1" values="-100%;200%" dur="6s" repeatCount="indefinite"/>
                  <animate attributeName="x2" values="0%;300%" dur="6s" repeatCount="indefinite"/>
                </line>
                {/* Center rotating diamond */}
                <g opacity="0.08" transform="translate(50%,50%)">
                  <rect x="-90" y="-90" width="180" height="180" fill="none" stroke="#C9A84C" strokeWidth="0.8" transform="rotate(45)">
                    <animateTransform attributeName="transform" type="rotate" from="45" to="405" dur="30s" repeatCount="indefinite"/>
                  </rect>
                  <rect x="-60" y="-60" width="120" height="120" fill="none" stroke="#E0BE7A" strokeWidth="0.5" transform="rotate(45)">
                    <animateTransform attributeName="transform" type="rotate" from="45" to="-315" dur="20s" repeatCount="indefinite"/>
                  </rect>
                </g>
                {/* Corner leaves */}
                <g opacity="0.35">
                  {/* TL — 2 leaves, spread apart */}
                  <g transform="translate(-5,0) rotate(-28)">
                    <path fill="none" stroke="#E0BE7A" strokeWidth="1.5" d="M0,0 C8,-45 45,-68 60,-44 C45,-22 12,-5 0,0Z"/>
                    <line stroke="#C9A84C" strokeWidth="0.7" x1="0" y1="0" x2="34" y2="-40"/>
                    <line stroke="#C9A84C" strokeWidth="0.5" x1="12" y1="-14" x2="42" y2="-34"/>
                  </g>
                  <g transform="translate(55,-8) rotate(-6)">
                    <path fill="none" stroke="#C9A84C" strokeWidth="1.2" d="M0,0 C6,-38 38,-56 50,-36 C38,-18 10,-4 0,0Z"/>
                    <line stroke="#C9A84C" strokeWidth="0.6" x1="0" y1="0" x2="28" y2="-32"/>
                  </g>
                  {/* TR — 2 leaves, spread apart */}
                  <g transform="translate(1205,0) rotate(208)">
                    <path fill="none" stroke="#E0BE7A" strokeWidth="1.5" d="M0,0 C8,-45 45,-68 60,-44 C45,-22 12,-5 0,0Z"/>
                    <line stroke="#C9A84C" strokeWidth="0.7" x1="0" y1="0" x2="34" y2="-40"/>
                    <line stroke="#C9A84C" strokeWidth="0.5" x1="12" y1="-14" x2="42" y2="-34"/>
                  </g>
                  <g transform="translate(1145,-8) rotate(186)">
                    <path fill="none" stroke="#C9A84C" strokeWidth="1.2" d="M0,0 C6,-38 38,-56 50,-36 C38,-18 10,-4 0,0Z"/>
                    <line stroke="#C9A84C" strokeWidth="0.6" x1="0" y1="0" x2="28" y2="-32"/>
                  </g>
                  {/* BL — 2 leaves, spread apart */}
                  <g transform="translate(-5,500) rotate(152)">
                    <path fill="none" stroke="#E0BE7A" strokeWidth="1.5" d="M0,0 C8,-45 45,-68 60,-44 C45,-22 12,-5 0,0Z"/>
                    <line stroke="#C9A84C" strokeWidth="0.7" x1="0" y1="0" x2="34" y2="-40"/>
                    <line stroke="#C9A84C" strokeWidth="0.5" x1="12" y1="-14" x2="42" y2="-34"/>
                  </g>
                  <g transform="translate(55,508) rotate(174)">
                    <path fill="none" stroke="#C9A84C" strokeWidth="1.2" d="M0,0 C6,-38 38,-56 50,-36 C38,-18 10,-4 0,0Z"/>
                    <line stroke="#C9A84C" strokeWidth="0.6" x1="0" y1="0" x2="28" y2="-32"/>
                  </g>
                  {/* BR — 2 leaves, spread apart */}
                  <g transform="translate(1205,500) rotate(-28)">
                    <path fill="none" stroke="#E0BE7A" strokeWidth="1.5" d="M0,0 C8,-45 45,-68 60,-44 C45,-22 12,-5 0,0Z"/>
                    <line stroke="#C9A84C" strokeWidth="0.7" x1="0" y1="0" x2="34" y2="-40"/>
                    <line stroke="#C9A84C" strokeWidth="0.5" x1="12" y1="-14" x2="42" y2="-34"/>
                  </g>
                  <g transform="translate(1145,508) rotate(-6)">
                    <path fill="none" stroke="#C9A84C" strokeWidth="1.2" d="M0,0 C6,-38 38,-56 50,-36 C38,-18 10,-4 0,0Z"/>
                    <line stroke="#C9A84C" strokeWidth="0.6" x1="0" y1="0" x2="28" y2="-32"/>
                  </g>
                  {/* CENTER scattered — 4 leaves, well spaced, no overlap */}
                  <g transform="translate(280,250) rotate(20)">
                    <path fill="none" stroke="#E0BE7A" strokeWidth="1" d="M0,0 C5,-30 30,-45 40,-29 C30,-14 8,-3 0,0Z"/>
                    <line stroke="#C9A84C" strokeWidth="0.5" x1="0" y1="0" x2="22" y2="-26"/>
                  </g>
                  <g transform="translate(920,250) rotate(-20)">
                    <path fill="none" stroke="#C9A84C" strokeWidth="1" d="M0,0 C5,-30 30,-45 40,-29 C30,-14 8,-3 0,0Z"/>
                    <line stroke="#C9A84C" strokeWidth="0.5" x1="0" y1="0" x2="22" y2="-26"/>
                  </g>
                  <g transform="translate(580,125) rotate(35)">
                    <path fill="none" stroke="#E0BE7A" strokeWidth="0.9" d="M0,0 C4,-26 26,-38 34,-24 C26,-12 7,-3 0,0Z"/>
                    <line stroke="#C9A84C" strokeWidth="0.4" x1="0" y1="0" x2="19" y2="-22"/>
                  </g>
                  <g transform="translate(620,375) rotate(-35)">
                    <path fill="none" stroke="#C9A84C" strokeWidth="0.9" d="M0,0 C4,-26 26,-38 34,-24 C26,-12 7,-3 0,0Z"/>
                    <line stroke="#C9A84C" strokeWidth="0.4" x1="0" y1="0" x2="19" y2="-22"/>
                  </g>
                </g>
              </svg>
            </div>
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
