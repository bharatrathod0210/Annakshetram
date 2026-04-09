import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import ProductCard from '../components/ProductCard';


export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const currentPage = Number(searchParams.get('page') || 1);
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get(`/products?page=${currentPage}&limit=12${currentCategory ? `&category=${currentCategory}` : ''}${currentSearch ? `&search=${currentSearch}` : ''}`),
          api.get('/categories'),
        ]);
        setProducts(prodRes.data.data.products);
        setTotal(prodRes.data.data.total);
        setPages(prodRes.data.data.pages);
        setCategories(catRes.data.data.categories);
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, [currentPage, currentCategory, currentSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    const value = e.target.search.value;
    const params = new URLSearchParams(searchParams);
    params.set('search', value);
    params.set('page', '1');
    setSearchParams(params);
  };

  const setCategory = (catId) => {
    const params = new URLSearchParams(searchParams);
    if (catId) params.set('category', catId);
    else params.delete('category');
    params.set('page', '1');
    setSearchParams(params);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasFilters = currentCategory || currentSearch;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-primary py-12 relative overflow-hidden">
        {/* Animated golden design */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 200">
            <defs>
              <radialGradient id="rg1_pr" cx="15%" cy="15%" r="45%">
                <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.22"/>
                <stop offset="100%" stopColor="#C9A84C" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="rg2_pr" cx="85%" cy="85%" r="45%">
                <stop offset="0%" stopColor="#E0BE7A" stopOpacity="0.18"/>
                <stop offset="100%" stopColor="#E0BE7A" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="rg3_pr" cx="85%" cy="15%" r="35%">
                <stop offset="0%" stopColor="#A8883A" stopOpacity="0.12"/>
                <stop offset="100%" stopColor="#A8883A" stopOpacity="0"/>
              </radialGradient>
            </defs>
            {/* Glow blobs */}
            <rect width="100%" height="100%" fill={`url(#rg1_pr)`}/>
            <rect width="100%" height="100%" fill={`url(#rg2_pr)`}/>
            <rect width="100%" height="100%" fill={`url(#rg3_pr)`}/>
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
            <g opacity="0.45" transform="translate(1200,0) scale(-1,1)">
              <path d="M0,0 Q80,0 80,80" fill="none" stroke="#C9A84C" strokeWidth="1.2"/>
              <path d="M0,0 Q52,0 52,52" fill="none" stroke="#E0BE7A" strokeWidth="0.7"/>
              <path d="M0,0 Q28,0 28,28" fill="none" stroke="#C9A84C" strokeWidth="0.4"/>
              <circle cx="0" cy="0" r="5" fill="none" stroke="#C9A84C" strokeWidth="1"/>
              <circle cx="0" cy="0" r="2" fill="#C9A84C" fillOpacity="0.5"/>
            </g>
            {/* BL corner arcs */}
            <g opacity="0.45" transform="translate(0,200) scale(1,-1)">
              <path d="M0,0 Q80,0 80,80" fill="none" stroke="#C9A84C" strokeWidth="1.2"/>
              <path d="M0,0 Q52,0 52,52" fill="none" stroke="#E0BE7A" strokeWidth="0.7"/>
              <path d="M0,0 Q28,0 28,28" fill="none" stroke="#C9A84C" strokeWidth="0.4"/>
              <circle cx="0" cy="0" r="5" fill="none" stroke="#C9A84C" strokeWidth="1"/>
              <circle cx="0" cy="0" r="2" fill="#C9A84C" fillOpacity="0.5"/>
            </g>
            {/* BR corner arcs */}
            <g opacity="0.45" transform="translate(1200,200) scale(-1,-1)">
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
            <g opacity="0.08" transform="translate(600,100)">
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
              <g transform="translate(-5,200) rotate(152)">
                <path fill="none" stroke="#E0BE7A" strokeWidth="1.5" d="M0,0 C8,-45 45,-68 60,-44 C45,-22 12,-5 0,0Z"/>
                <line stroke="#C9A84C" strokeWidth="0.7" x1="0" y1="0" x2="34" y2="-40"/>
                <line stroke="#C9A84C" strokeWidth="0.5" x1="12" y1="-14" x2="42" y2="-34"/>
              </g>
              <g transform="translate(55,208) rotate(174)">
                <path fill="none" stroke="#C9A84C" strokeWidth="1.2" d="M0,0 C6,-38 38,-56 50,-36 C38,-18 10,-4 0,0Z"/>
                <line stroke="#C9A84C" strokeWidth="0.6" x1="0" y1="0" x2="28" y2="-32"/>
              </g>
              {/* BR — 2 leaves, spread apart */}
              <g transform="translate(1205,200) rotate(-28)">
                <path fill="none" stroke="#E0BE7A" strokeWidth="1.5" d="M0,0 C8,-45 45,-68 60,-44 C45,-22 12,-5 0,0Z"/>
                <line stroke="#C9A84C" strokeWidth="0.7" x1="0" y1="0" x2="34" y2="-40"/>
                <line stroke="#C9A84C" strokeWidth="0.5" x1="12" y1="-14" x2="42" y2="-34"/>
              </g>
              <g transform="translate(1145,208) rotate(-6)">
                <path fill="none" stroke="#C9A84C" strokeWidth="1.2" d="M0,0 C6,-38 38,-56 50,-36 C38,-18 10,-4 0,0Z"/>
                <line stroke="#C9A84C" strokeWidth="0.6" x1="0" y1="0" x2="28" y2="-32"/>
              </g>
              {/* CENTER scattered — 4 leaves, well spaced, no overlap */}
              <g transform="translate(280,100) rotate(20)">
                <path fill="none" stroke="#E0BE7A" strokeWidth="1" d="M0,0 C5,-30 30,-45 40,-29 C30,-14 8,-3 0,0Z"/>
                <line stroke="#C9A84C" strokeWidth="0.5" x1="0" y1="0" x2="22" y2="-26"/>
              </g>
              <g transform="translate(920,100) rotate(-20)">
                <path fill="none" stroke="#C9A84C" strokeWidth="1" d="M0,0 C5,-30 30,-45 40,-29 C30,-14 8,-3 0,0Z"/>
                <line stroke="#C9A84C" strokeWidth="0.5" x1="0" y1="0" x2="22" y2="-26"/>
              </g>
              <g transform="translate(580,50) rotate(35)">
                <path fill="none" stroke="#E0BE7A" strokeWidth="0.9" d="M0,0 C4,-26 26,-38 34,-24 C26,-12 7,-3 0,0Z"/>
                <line stroke="#C9A84C" strokeWidth="0.4" x1="0" y1="0" x2="19" y2="-22"/>
              </g>
              <g transform="translate(620,150) rotate(-35)">
                <path fill="none" stroke="#C9A84C" strokeWidth="0.9" d="M0,0 C4,-26 26,-38 34,-24 C26,-12 7,-3 0,0Z"/>
                <line stroke="#C9A84C" strokeWidth="0.4" x1="0" y1="0" x2="19" y2="-22"/>
              </g>
            </g>
          </svg>
        </div>
        <div className="container-custom relative z-10 text-center">
          <p className="text-accent text-sm font-medium mb-2">✦ Pure & Organic</p>
          <h1 className="font-heading text-4xl font-bold text-cream mb-2">Our Products</h1>
          <p className="text-cream/70">Discover our range of satvik, traditional food products</p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-text-light" />
            <input
              type="text"
              name="search"
              defaultValue={currentSearch}
              placeholder="Search products..."
              className="input-field pl-10"
            />
          </form>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border font-medium text-sm transition-all sm:hidden ${showFilters ? 'bg-primary text-cream border-primary' : 'border-border text-text-secondary hover:border-primary'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters {currentCategory && <span className="bg-accent text-primary-dark rounded-lg w-5 h-5 text-xs flex items-center justify-center">1</span>}
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Categories */}
          <aside className={`${showFilters ? 'block' : 'hidden'} sm:block w-60 flex-shrink-0`}>
            <div className="card p-4 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-primary">Categories</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                    <X className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setCategory('')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${!currentCategory ? 'bg-primary text-cream' : 'text-text-secondary hover:bg-muted'}`}
                  >
                    All Products <span className="text-xs opacity-60">({total})</span>
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.categoryId}>
                    <button
                      onClick={() => setCategory(cat.categoryId)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentCategory === cat.categoryId ? 'bg-primary text-cream' : 'text-text-secondary hover:bg-muted'}`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="aspect-square bg-muted" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                      <div className="h-10 bg-muted rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-5xl block mb-4">🌾</span>
                <h3 className="font-heading text-xl font-semibold text-primary mb-2">No products found</h3>
                <p className="text-text-secondary mb-4">Try different filters or search terms</p>
                <button onClick={clearFilters} className="btn-outline text-sm">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-text-secondary text-sm">
                    Showing <span className="font-semibold text-primary">{products.length}</span> of <span className="font-semibold text-primary">{total}</span> products
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(product => (
                    <ProductCard key={product.productId} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {[...Array(pages)].map((_, i) => {
                      const pageNum = i + 1;
                      const params = new URLSearchParams(searchParams);
                      params.set('page', pageNum);
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setSearchParams(params)}
                          className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${pageNum === currentPage ? 'bg-primary text-cream' : 'bg-white border border-border text-text-secondary hover:border-primary hover:text-primary'}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
