import { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Leaf, Send } from 'lucide-react';
import useSettingsStore from '../store/useSettingsStore';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const { settings } = useSettingsStore();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all required fields');
      return;
    }
    const msg = `*New Inquiry from Website*\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nMessage:\n${form.message}`;
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    setSubmitted(true);
    toast.success('Redirecting to WhatsApp... 🌿');
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container-custom text-center">
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
                  <li className="flex justify-between"><span>Monday — Saturday</span><span className="text-primary font-medium">9:00 AM – 7:00 PM</span></li>
                  <li className="flex justify-between"><span>Sunday</span><span className="text-text-light">Closed</span></li>
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
