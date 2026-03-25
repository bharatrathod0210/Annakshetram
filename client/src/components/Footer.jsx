import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import logo from '../assets/English.png';


export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-primary text-cream relative overflow-hidden">
      {/* Animated golden design */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 400">
          <defs>
            <radialGradient id="rg1_ft" cx="15%" cy="15%" r="45%">
              <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.22"/>
              <stop offset="100%" stopColor="#C9A84C" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="rg2_ft" cx="85%" cy="85%" r="45%">
              <stop offset="0%" stopColor="#E0BE7A" stopOpacity="0.18"/>
              <stop offset="100%" stopColor="#E0BE7A" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="rg3_ft" cx="85%" cy="15%" r="35%">
              <stop offset="0%" stopColor="#A8883A" stopOpacity="0.12"/>
              <stop offset="100%" stopColor="#A8883A" stopOpacity="0"/>
            </radialGradient>
          </defs>
          {/* Glow blobs */}
          <rect width="100%" height="100%" fill={`url(#rg1_ft)`}/>
          <rect width="100%" height="100%" fill={`url(#rg2_ft)`}/>
          <rect width="100%" height="100%" fill={`url(#rg3_ft)`}/>
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
            <g transform="translate(-5,400) rotate(152)">
              <path fill="none" stroke="#E0BE7A" strokeWidth="1.5" d="M0,0 C8,-45 45,-68 60,-44 C45,-22 12,-5 0,0Z"/>
              <line stroke="#C9A84C" strokeWidth="0.7" x1="0" y1="0" x2="34" y2="-40"/>
              <line stroke="#C9A84C" strokeWidth="0.5" x1="12" y1="-14" x2="42" y2="-34"/>
            </g>
            <g transform="translate(55,408) rotate(174)">
              <path fill="none" stroke="#C9A84C" strokeWidth="1.2" d="M0,0 C6,-38 38,-56 50,-36 C38,-18 10,-4 0,0Z"/>
              <line stroke="#C9A84C" strokeWidth="0.6" x1="0" y1="0" x2="28" y2="-32"/>
            </g>
            {/* BR — 2 leaves, spread apart */}
            <g transform="translate(1205,400) rotate(-28)">
              <path fill="none" stroke="#E0BE7A" strokeWidth="1.5" d="M0,0 C8,-45 45,-68 60,-44 C45,-22 12,-5 0,0Z"/>
              <line stroke="#C9A84C" strokeWidth="0.7" x1="0" y1="0" x2="34" y2="-40"/>
              <line stroke="#C9A84C" strokeWidth="0.5" x1="12" y1="-14" x2="42" y2="-34"/>
            </g>
            <g transform="translate(1145,408) rotate(-6)">
              <path fill="none" stroke="#C9A84C" strokeWidth="1.2" d="M0,0 C6,-38 38,-56 50,-36 C38,-18 10,-4 0,0Z"/>
              <line stroke="#C9A84C" strokeWidth="0.6" x1="0" y1="0" x2="28" y2="-32"/>
            </g>
            {/* CENTER scattered — 4 leaves, well spaced, no overlap */}
            <g transform="translate(280,200) rotate(20)">
              <path fill="none" stroke="#E0BE7A" strokeWidth="1" d="M0,0 C5,-30 30,-45 40,-29 C30,-14 8,-3 0,0Z"/>
              <line stroke="#C9A84C" strokeWidth="0.5" x1="0" y1="0" x2="22" y2="-26"/>
            </g>
            <g transform="translate(920,200) rotate(-20)">
              <path fill="none" stroke="#C9A84C" strokeWidth="1" d="M0,0 C5,-30 30,-45 40,-29 C30,-14 8,-3 0,0Z"/>
              <line stroke="#C9A84C" strokeWidth="0.5" x1="0" y1="0" x2="22" y2="-26"/>
            </g>
            <g transform="translate(580,100) rotate(35)">
              <path fill="none" stroke="#E0BE7A" strokeWidth="0.9" d="M0,0 C4,-26 26,-38 34,-24 C26,-12 7,-3 0,0Z"/>
              <line stroke="#C9A84C" strokeWidth="0.4" x1="0" y1="0" x2="19" y2="-22"/>
            </g>
            <g transform="translate(620,300) rotate(-35)">
              <path fill="none" stroke="#C9A84C" strokeWidth="0.9" d="M0,0 C4,-26 26,-38 34,-24 C26,-12 7,-3 0,0Z"/>
              <line stroke="#C9A84C" strokeWidth="0.4" x1="0" y1="0" x2="19" y2="-22"/>
            </g>
          </g>
        </svg>
      </div>
      {/* Top gold line */}
      <div className="h-1 bg-gradient-gold relative z-10" />

      <div className="container-custom py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Annakshetram" className="h-16 w-auto object-contain rounded-lg" />
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
                info@annakshetram.com
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
            <logo className="w-3 h-3 text-accent/60" />
            <span>100% Natural • Zero Preservatives • Satvik Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
