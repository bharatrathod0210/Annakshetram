import { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Leaf, Send } from 'lucide-react';
import useSettingsStore from '../store/useSettingsStore';
import toast from 'react-hot-toast';


export default function ContactPage() {
  const { settings } = useSettingsStore();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all required fields');
      return;
    }
    const msg = `*New Inquiry from Website*\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nAddress: ${form.address}\n\nMessage:\n${form.message}`;
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    setSubmitted(true);
    toast.success('Redirecting to WhatsApp... 🌿');
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary py-16 relative overflow-hidden">
        {/* Animated golden design */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 600">
            <defs>
              <radialGradient id="rg1_ct" cx="15%" cy="15%" r="45%">
                <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.22"/>
                <stop offset="100%" stopColor="#C9A84C" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="rg2_ct" cx="85%" cy="85%" r="45%">
                <stop offset="0%" stopColor="#E0BE7A" stopOpacity="0.18"/>
                <stop offset="100%" stopColor="#E0BE7A" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="rg3_ct" cx="85%" cy="15%" r="35%">
                <stop offset="0%" stopColor="#A8883A" stopOpacity="0.12"/>
                <stop offset="100%" stopColor="#A8883A" stopOpacity="0"/>
              </radialGradient>
            </defs>
            {/* Glow blobs */}
            <rect width="100%" height="100%" fill={`url(#rg1_ct)`}/>
            <rect width="100%" height="100%" fill={`url(#rg2_ct)`}/>
            <rect width="100%" height="100%" fill={`url(#rg3_ct)`}/>
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
              {/* TL to 2 leaves, spread apart */}
              <g transform="translate(-5,0) rotate(-28)">
                <path fill="none" stroke="#E0BE7A" strokeWidth="1.5" d="M0,0 C8,-45 45,-68 60,-44 C45,-22 12,-5 0,0Z"/>
                <line stroke="#C9A84C" strokeWidth="0.7" x1="0" y1="0" x2="34" y2="-40"/>
                <line stroke="#C9A84C" strokeWidth="0.5" x1="12" y1="-14" x2="42" y2="-34"/>
              </g>
              <g transform="translate(55,-8) rotate(-6)">
                <path fill="none" stroke="#C9A84C" strokeWidth="1.2" d="M0,0 C6,-38 38,-56 50,-36 C38,-18 10,-4 0,0Z"/>
                <line stroke="#C9A84C" strokeWidth="0.6" x1="0" y1="0" x2="28" y2="-32"/>
              </g>
              {/* TR to 2 leaves, spread apart */}
              <g transform="translate(1205,0) rotate(208)">
                <path fill="none" stroke="#E0BE7A" strokeWidth="1.5" d="M0,0 C8,-45 45,-68 60,-44 C45,-22 12,-5 0,0Z"/>
                <line stroke="#C9A84C" strokeWidth="0.7" x1="0" y1="0" x2="34" y2="-40"/>
                <line stroke="#C9A84C" strokeWidth="0.5" x1="12" y1="-14" x2="42" y2="-34"/>
              </g>
              <g transform="translate(1145,-8) rotate(186)">
                <path fill="none" stroke="#C9A84C" strokeWidth="1.2" d="M0,0 C6,-38 38,-56 50,-36 C38,-18 10,-4 0,0Z"/>
                <line stroke="#C9A84C" strokeWidth="0.6" x1="0" y1="0" x2="28" y2="-32"/>
              </g>
              {/* BL to 2 leaves, spread apart */}
              <g transform="translate(-5,600) rotate(152)">
                <path fill="none" stroke="#E0BE7A" strokeWidth="1.5" d="M0,0 C8,-45 45,-68 60,-44 C45,-22 12,-5 0,0Z"/>
                <line stroke="#C9A84C" strokeWidth="0.7" x1="0" y1="0" x2="34" y2="-40"/>
                <line stroke="#C9A84C" strokeWidth="0.5" x1="12" y1="-14" x2="42" y2="-34"/>
              </g>
              <g transform="translate(55,608) rotate(174)">
                <path fill="none" stroke="#C9A84C" strokeWidth="1.2" d="M0,0 C6,-38 38,-56 50,-36 C38,-18 10,-4 0,0Z"/>
                <line stroke="#C9A84C" strokeWidth="0.6" x1="0" y1="0" x2="28" y2="-32"/>
              </g>
              {/* BR to 2 leaves, spread apart */}
              <g transform="translate(1205,600) rotate(-28)">
                <path fill="none" stroke="#E0BE7A" strokeWidth="1.5" d="M0,0 C8,-45 45,-68 60,-44 C45,-22 12,-5 0,0Z"/>
                <line stroke="#C9A84C" strokeWidth="0.7" x1="0" y1="0" x2="34" y2="-40"/>
                <line stroke="#C9A84C" strokeWidth="0.5" x1="12" y1="-14" x2="42" y2="-34"/>
              </g>
              <g transform="translate(1145,608) rotate(-6)">
                <path fill="none" stroke="#C9A84C" strokeWidth="1.2" d="M0,0 C6,-38 38,-56 50,-36 C38,-18 10,-4 0,0Z"/>
                <line stroke="#C9A84C" strokeWidth="0.6" x1="0" y1="0" x2="28" y2="-32"/>
              </g>
              {/* CENTER scattered to 4 leaves, well spaced, no overlap */}
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
        <div className="container-custom text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent rounded-lg px-4 py-1.5 text-sm font-medium mb-4">
            <Leaf className="w-4 h-4" /> Get in Touch
          </div>
          <h1 className="font-heading text-4xl font-bold text-cream mb-3">Contact Us</h1>
          <p className="text-cream/70 text-lg">We'd love to hear from you. Reach out anytime!</p>
        </div>
      </section>

      <section className="py-16 bg-cream">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="card p-6">
                <h2 className="font-heading text-xl font-semibold text-primary mb-4">Contact Information</h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-text-light font-medium uppercase tracking-wide mb-0.5">Phone</p>
                      <p className="text-text-primary font-medium">{settings.contactPhone}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-text-light font-medium uppercase tracking-wide mb-0.5">Email</p>
                      <p className="text-text-primary font-medium">{settings.contactEmail}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-text-light font-medium uppercase tracking-wide mb-0.5">Address</p>
                      <p className="text-text-primary font-medium">{settings.address}</p>
                    </div>
                  </li>
                </ul>
              </div>

              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 bg-green-500 text-white p-5 rounded-lg hover:bg-green-600 transition-colors shadow-md group"
              >
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-lg">Chat on WhatsApp</p>
                  <p className="text-white/80 text-sm">Usually replies within 1 hour</p>
                </div>
              </a>

              <div className="card p-5">
                <h3 className="font-semibold text-primary mb-2">Business Hours</h3>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li className="flex justify-between"><span>Monday to Saturday</span><span className="text-primary font-medium">9:00 AM to 7:00 PM</span></li>
                  <li className="flex justify-between"><span>Sunday</span><span className="text-text-light">9:00 AM - 1:00PM</span></li>
                </ul>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2 card p-8">
              <h2 className="font-heading text-2xl font-semibold text-primary mb-6">Send us a Message</h2>
              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">🌿</div>
                  <h3 className="font-heading text-2xl font-bold text-primary mb-2">Message Sent!</h3>
                  <p className="text-text-secondary mb-4">We'll get back to you soon. In the meantime, feel free to WhatsApp us!</p>
                  <button onClick={() => setSubmitted(false)} className="btn-outline text-sm">Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">Name *</label>
                      <input type="text" className="input-field" placeholder="Your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">Email *</label>
                      <input type="email" className="input-field" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">Phone</label>
                    <input type="tel" className="input-field" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">Address</label>
                    <input type="text" className="input-field" placeholder="Your full address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">Message *</label>
                    <textarea rows={5} className="input-field resize-none" placeholder="Tell us about your inquiry, order, or feedback..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                  </div>
                  <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
                    <Send className="w-4 h-4" /> Send via WhatsApp
                  </button>
                  <p className="text-center text-xs text-text-light">This will open WhatsApp with your message pre-filled</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
