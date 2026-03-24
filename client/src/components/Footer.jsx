import { Link } from 'react-router-dom';
import { Leaf, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-primary text-cream">
      {/* Top wave */}
      <div className="h-1 bg-gradient-gold" />

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center border border-accent/40">
                <Leaf className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-heading font-bold text-xl">Annakshetram</p>
                <p className="text-xs text-accent">Satvikam • Shuddham</p>
              </div>
            </div>
            <p className="text-cream/70 text-sm leading-relaxed">
              Pure, organic, and traditional food products crafted with love and care, honoring the ancient tradition of satvik living.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-accent mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[['Home', '/'], ['Products', '/products'], ['About Us', '/about'], ['Contact', '/contact']].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-cream/70 hover:text-accent transition-colors text-sm flex items-center gap-1 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/50 group-hover:bg-accent transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-accent mb-4">Our Products</h3>
            <ul className="space-y-2">
              {['Rice & Grains', 'Flours & Millets', 'Oils & Ghee', 'Spices & Masalas', 'Snacks & Sweets'].map(cat => (
                <li key={cat}>
                  <Link to={`/products?search=${cat}`} className="text-cream/70 hover:text-accent transition-colors text-sm flex items-center gap-1 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/50 group-hover:bg-accent transition-colors" />
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-accent mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-cream/70 text-sm">
                <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                Karnataka, India
              </li>
              <li className="flex items-center gap-2 text-cream/70 text-sm">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                +91 90357 35818
              </li>
              <li className="flex items-center gap-2 text-cream/70 text-sm">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                contact@annakshetram.com
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center hover:bg-accent/40 transition-colors" />
              <a href="#" className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center hover:bg-accent/40 transition-colors" />
            </div>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cream/50 text-sm">© {year} Annakshetram. All rights reserved.</p>
          <div className="flex items-center gap-1 text-cream/40 text-xs">
            <Leaf className="w-3 h-3 text-accent/60" />
            <span>100% Natural • Zero Preservatives • Satvik Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
