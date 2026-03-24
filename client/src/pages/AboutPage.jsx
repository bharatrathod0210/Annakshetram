import { Leaf, Heart, Shield, Award, Sprout, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const values = [
    { icon: Leaf, title: 'Time-Tested Recipes', desc: 'Rooted in recipes passed down through generations, straight from our home kitchen.' },
    { icon: Shield, title: 'Clean & Honest Ingredients', desc: 'No shortcuts, no fillers — every ingredient is chosen with care and transparency.' },
    { icon: Award, title: 'Traditional Roasting Methods', desc: 'Slow-roasted the old way, preserving the natural aroma, taste, and nutrition.' },
    { icon: Heart, title: 'Satvik Principles', desc: 'No onion, no garlic — pure satvik food prepared with devotion and mindfulness.' },
    { icon: Sprout, title: 'Nourishment for Body & Mind', desc: 'Food that feeds not just the body, but brings calm, clarity, and energy to daily life.' },
  ];

  return (
    <div className="bg-[#FDF8F0]">

      {/* Hero */}
      <section className="bg-[#6B1414] py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E0BE7A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E0BE7A]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="container-custom relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#E0BE7A]/20 text-[#E0BE7A] rounded-lg px-4 py-1.5 text-sm font-medium mb-6">
            <Leaf className="w-4 h-4" /> Our Story
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">The Story Behind Annakshetram</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto italic">
            "Shuddham Bhojanam. Satvikam Jeevanam."
          </p>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-16 bg-white">
        <div className="container-custom max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-[#E0BE7A] text-2xl mb-2">✦</div>
            <h2 className="font-heading text-3xl font-bold text-[#6B1414]">It began at our dining table</h2>
          </div>

          <div className="space-y-5 text-[#4A3728] leading-relaxed text-[15px]">
            <p>
              Annakshetram began not in a factory or an office — it began at our dining table.
            </p>
            <p>
              One day, during a casual conversation at home, my husband suggested, with a playful seriousness,{' '}
              <span className="italic text-[#6B1414] font-medium">"You should make your puliyogare gojju and sell it."</span> he smirked!!
            </p>
            <p>
              He would often joke that I make such good bajjis that I should open a small stall right outside our house. Like many such conversations, I smiled and brushed it aside.
            </p>

            <div className="border-l-4 border-[#E0BE7A] pl-5 py-2 bg-[#FDF8F0] rounded-r-lg">
              <p className="italic text-[#6B1414] font-medium text-base">But the idea stayed...</p>
            </div>

            <p>
              Soon after, my sister — who has always been a big admirer of my cooking — encouraged me again. With both of them believing in me more than I believed in myself, I finally decided to try.
            </p>
            <p>
              I prepared a few batches and distributed samples to friends and well-wishers, not knowing what to expect.
            </p>

            <div className="bg-[#6B1414]/5 border border-[#6B1414]/15 rounded-lg p-5 text-center">
              <Quote className="w-6 h-6 text-[#E0BE7A] mx-auto mb-2" />
              <p className="text-[#6B1414] font-semibold text-base">The response was overwhelming.</p>
              <p className="text-[#4A3728] text-sm mt-1">
                People didn't just appreciate the taste — they appreciated the homely flavor, traditional authenticity, and purity they had been missing in everyday food.
              </p>
            </div>

            <p>
              As the demand slowly increased, my mother stepped into the kitchen with me and helped prepare the first larger batches. Together, we worked just the way food has always been prepared in our homes — with patience, care, and devotion.
            </p>

            <div className="border-l-4 border-[#6B1414] pl-5 py-2">
              <p className="text-[#6B1414] font-semibold">That moment became the beginning of Annakshetram.</p>
            </div>

            <p>
              What started as a simple suggestion across the dining table slowly grew into a heartfelt effort to share satvik, traditional, clean food with more families — just the way it is prepared in our homes.
            </p>

            <div className="bg-gradient-to-r from-[#6B1414] to-[#8B1A1A] rounded-lg p-6 text-center text-white">
              <p className="font-heading text-lg font-semibold leading-relaxed">
                "To serve food with sincerity, nourishment, and devotion."
              </p>
              <p className="text-white/70 text-sm mt-2">— The intention behind every Annakshetram product</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rooted In */}
      <section className="py-16 bg-[#FDF8F0]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="text-[#E0BE7A] text-2xl mb-2">✦</div>
            <h2 className="font-heading text-3xl font-bold text-[#6B1414] mb-3">Our products are rooted in</h2>
            <p className="text-[#6B5744] max-w-lg mx-auto text-sm">
              Every preparation carries the warmth of a home kitchen and the strength of ancestral wisdom.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-[#E5D5C0] rounded-lg p-6 hover:shadow-md transition-all group">
                <div className="w-11 h-11 bg-[#6B1414]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#6B1414] transition-all">
                  <Icon className="w-5 h-5 text-[#6B1414] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-heading text-base font-semibold text-[#6B1414] mb-2">🌾 {title}</h3>
                <p className="text-[#6B5744] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
            {/* 6th card — belief statement */}
            <div className="bg-[#6B1414] rounded-lg p-6 flex flex-col justify-center">
              <p className="text-[#E0BE7A] font-heading text-base font-semibold mb-2">We believe...</p>
              <p className="text-white/85 text-sm leading-relaxed">
                When food is prepared with purity, it becomes more than nutrition — it becomes prasadam-like energy for daily life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Statement */}
      <section className="py-16 bg-white">
        <div className="container-custom max-w-2xl mx-auto text-center">
          <div className="text-[#E0BE7A] text-2xl mb-6">✦</div>
          <h2 className="font-heading text-2xl font-bold text-[#6B1414] mb-4">Annakshetram is not just a brand.</h2>
          <div className="space-y-3 text-[#4A3728] text-base leading-relaxed">
            <p>It is a return to mindful eating.</p>
            <p>It is a step toward satvik living.</p>
          </div>
          <div className="mt-8 py-6 border-t border-b border-[#E5D5C0]">
            <p className="font-heading text-xl font-bold text-[#6B1414] italic">
              Shuddham Bhojanam. Satvikam Jeevanam.
            </p>
          </div>
          <div className="mt-8">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-[#6B1414] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#8B1A1A] transition-colors"
            >
              <Leaf className="w-4 h-4" /> Explore Our Products
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
