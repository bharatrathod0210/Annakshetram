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
        {/* Animated golden design */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 600">
            <defs>
              <radialGradient id="rg1_ab" cx="15%" cy="15%" r="45%">
                <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.22"/>
                <stop offset="100%" stopColor="#C9A84C" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="rg2_ab" cx="85%" cy="85%" r="45%">
                <stop offset="0%" stopColor="#E0BE7A" stopOpacity="0.18"/>
                <stop offset="100%" stopColor="#E0BE7A" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="rg3_ab" cx="85%" cy="15%" r="35%">
                <stop offset="0%" stopColor="#A8883A" stopOpacity="0.12"/>
                <stop offset="100%" stopColor="#A8883A" stopOpacity="0"/>
              </radialGradient>
            </defs>
            {/* Glow blobs */}
            <rect width="100%" height="100%" fill={`url(#rg1_ab)`}/>
            <rect width="100%" height="100%" fill={`url(#rg2_ab)`}/>
            <rect width="100%" height="100%" fill={`url(#rg3_ab)`}/>
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
            <h2 className="font-heading text-3xl font-bold text-[#6B1414]">It began at our dining table!</h2>
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

            <div className="bg-gradient-to-r from-[#6B1414] to-[#6B1414] rounded-lg p-6 text-center text-white">
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
              className="inline-flex items-center gap-2 bg-[#6B1414] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#6B1414] transition-colors"
            >
              <Leaf className="w-4 h-4" /> Explore Our Products
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
