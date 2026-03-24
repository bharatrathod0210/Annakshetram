import { Leaf, Heart, Shield, Award, Users, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const values = [
    { icon: Leaf, title: 'Pure & Natural', desc: 'Every ingredient we use is sourced from certified organic farms with zero use of chemicals.' },
    { icon: Shield, title: 'No Preservatives', desc: 'We firmly believe food should be as nature made it — free from artificial additives.' },
    { icon: Heart, title: 'Made with Love', desc: 'Each product is crafted with the care and attention of a family kitchen.' },
    { icon: Award, title: 'Traditional Methods', desc: 'Ancient techniques like stone-grinding and cold-pressing preserve nutrition and flavour.' },
    { icon: Users, title: 'Community First', desc: 'We support local farmers and contribute to sustainable agricultural practices.' },
    { icon: Sprout, title: 'Sustainability', desc: 'Our packaging is eco-friendly, our processes waste-minimal, our planet respected.' },
  ];

  const milestones = [
    { year: '2019', title: 'Founded', desc: 'Annakshetram was born from a simple dream — bring pure, satvik food to every home.' },
    { year: '2020', title: 'First Products', desc: 'Launched our first line of organic rice and cold-pressed oils to overwhelmingly positive response.' },
    { year: '2022', title: 'Growing Family', desc: 'Expanded to 50+ products, partnered with 30+ organic farmers across Karnataka.' },
    { year: '2024', title: 'Online Launch', desc: 'Bringing Annakshetram to families across India through our online store.' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent rounded-lg px-4 py-1.5 text-sm font-medium mb-6">
            <Leaf className="w-4 h-4" /> Our Story
          </div>
          <h1 className="font-heading text-5xl font-bold text-cream mb-4">About Annakshetram</h1>
          <p className="text-cream/80 text-xl max-w-2xl mx-auto leading-relaxed">
            "Satvikam Jeevanam, Shuddham Bhojanam" — We are more than a brand. We are a movement towards pure, conscious living.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="ornament mb-4"><span className="text-accent text-sm">✦</span></div>
              <h2 className="section-title">The Story Behind Our Name</h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  <strong className="text-primary">Annakshetram</strong> means "The Field of Food" in Sanskrit. It represents our deep connection to the land, to the farmer, and to the ancient wisdom of nourishing the body with pure, satvik food.
                </p>
                <p>
                  Our founder, inspired by the memory of his grandmother's kitchen in rural Karnataka, set out to recreate that magical combination of taste, nutrition, and purity that modern food has lost. The journey began with a small batch of cold-pressed coconut oil, shared with neighbors — and their response was overwhelming.
                </p>
                <p>
                  Today, Annakshetram works with over 30 organic farmers, processes food using traditional methods, and delivers pure goodness to hundreds of families. But our mission remains the same: <em className="text-primary">make pure food accessible to every Indian home.</em>
                </p>
              </div>
              <Link to="/products" className="btn-primary mt-6 inline-flex items-center gap-2">
                Explore Our Products
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {['🌾', '🥥', '🫙', '🌿'].map((emoji, i) => (
                <div key={i} className={`rounded-lg p-8 flex items-center justify-center text-6xl ${i % 2 === 0 ? 'bg-primary/10' : 'bg-accent/10'} hover:scale-105 transition-transform`}>
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-cream">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="ornament mb-3"><span className="text-accent text-sm">✦</span></div>
            <h2 className="section-title">Our Core Values</h2>
            <p className="section-subtitle">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 hover:shadow-warm transition-all group">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary transition-all">
                  <Icon className="w-6 h-6 text-primary group-hover:text-cream transition-colors" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-primary mb-2">{title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="ornament mb-3"><span className="text-accent text-sm">✦</span></div>
            <h2 className="section-title">Our Journey</h2>
            <p className="section-subtitle">From a dream to a movement</p>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-transparent hidden md:block" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={m.year} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-maroon flex items-center justify-center shadow-warm relative z-10">
                    <span className="font-heading font-bold text-cream text-sm">{m.year}</span>
                  </div>
                  <div className="card p-5 flex-1 hover:shadow-warm transition-all animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                    <h3 className="font-heading text-lg font-semibold text-primary mb-1">{m.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container-custom text-center">
          <h2 className="font-heading text-3xl font-bold text-cream mb-4">Be Part of the Satvik Movement</h2>
          <p className="text-cream/70 text-lg mb-8 max-w-xl mx-auto">
            Join us in our mission to bring pure, nourishing food back to every Indian household.
          </p>
          <Link to="/products" className="btn-gold px-8 py-4 text-base">Start Shopping</Link>
        </div>
      </section>
    </div>
  );
}
