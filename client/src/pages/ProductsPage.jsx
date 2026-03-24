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
      <div className="bg-primary py-12">
        <div className="container-custom">
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
