import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import logo from '../assets/English.png';

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuthStore();
  const { getCount, setOpen } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const handleNavClick = (to) => {
    if (to === '/' && location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  const isHome = location.pathname === '/';
  const isActive = (path) => location.pathname === path;
  const isTransparent = isHome && !scrolled;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${isTransparent
        ? 'bg-[#6B1414]/60 backdrop-blur-sm border-b border-white/10'
        : 'bg-white/95 backdrop-blur-md border-b border-[#E5D5C0] shadow-sm'
      }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src={logo}
              alt="Annakshetram"
              className="h-14 w-auto object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
            />
            <div>
              <p className={`font-heading font-bold text-lg leading-tight transition-colors duration-300 ${isTransparent ? 'text-white' : 'text-[#8B1A1A]'
                }`}>
                Annakshetram
              </p>
              <p className={`text-[10px] font-semibold tracking-widest uppercase transition-colors duration-300 ${isTransparent ? 'text-[#E0BE7A]' : 'text-[#A8883A]'
                }`}>
                Shuddham Bhojanam • Satvikam Jeevanam
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => handleNavClick(link.to)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.to)
                    ? isTransparent
                      ? 'bg-white/25 text-white font-semibold'
                      : 'bg-[#6B1414] text-white font-semibold'
                    : isTransparent
                      ? 'text-white/80 hover:text-white hover:bg-white/15'
                      : 'text-[#5C4A3A] hover:text-[#6B1414] hover:bg-[#6B1414]/8'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">

            {/* Cart */}
            <button
              onClick={() => setOpen(true)}
              className={`relative p-2 rounded-lg transition-all duration-200 ${isTransparent
                  ? 'text-white/90 hover:text-white hover:bg-white/15'
                  : 'text-[#5C4A3A] hover:text-[#6B1414] hover:bg-[#6B1414]/8'
                }`}
              aria-label="Open cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {getCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C9A84C] text-[#6B1414] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-scale-in shadow-gold">
                  {getCount()}
                </span>
              )}
            </button>

            {/* Auth */}
            {isAuthenticated() ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${isTransparent ? 'hover:bg-white/15' : 'hover:bg-[#6B1414]/8'
                    }`}
                >
                  <div className="w-8 h-8 bg-gradient-maroon rounded-full flex items-center justify-center ring-2 ring-[#C9A84C]/40">
                    <span className="text-white text-xs font-bold">{user?.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <span className={`hidden sm:block text-sm font-medium transition-colors ${isTransparent ? 'text-white' : 'text-[#1A0A00]'
                    }`}>
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-warm-lg border border-[#E5D5C0] py-2 animate-slide-down z-50">
                    {isAdmin() && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#6B1414] hover:bg-[#6B1414]/5 font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#5C4A3A] hover:bg-[#F3EDE3]"
                    >
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <hr className="my-1 border-[#E5D5C0]" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className={`py-2 px-4 text-sm rounded-lg font-semibold border-2 transition-all duration-200 ${isTransparent
                      ? 'border-white/50 text-white hover:bg-white/15'
                      : 'border-[#6B1414] text-[#6B1414] hover:bg-[#6B1414] hover:text-white'
                    }`}
                >
                  Login
                </Link>
                <Link to="/register" className="btn-gold py-2 px-4 text-sm">Sign Up</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className={`md:hidden p-2 rounded-lg transition-all ${isTransparent
                  ? 'text-white hover:bg-white/15'
                  : 'text-[#5C4A3A] hover:bg-[#6B1414]/8'
                }`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className={`md:hidden py-4 border-t animate-slide-down ${isTransparent
              ? 'border-white/20 bg-[#6B1414]/95 backdrop-blur-sm'
              : 'border-[#E5D5C0] bg-white'
            }`}>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => handleNavClick(link.to)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium mb-1 transition-all ${isActive(link.to)
                    ? isTransparent
                      ? 'bg-white/20 text-white font-semibold'
                      : 'bg-[#6B1414] text-white font-semibold'
                    : isTransparent
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-[#5C4A3A] hover:text-[#6B1414] hover:bg-[#F3EDE3]'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated() && (
              <div className="flex gap-2 mt-4">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline py-2 px-4 text-sm flex-1 text-center">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-gold py-2 px-4 text-sm flex-1 text-center">Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
