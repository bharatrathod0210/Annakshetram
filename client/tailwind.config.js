/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B1A1A',
          light: '#C0392B',
          dark: '#6B1414',
          foreground: '#FDF8F0',
        },
        accent: {
          DEFAULT: '#C9A84C',
          light: '#E0BE7A',
          dark: '#A8883A',
        },
        cream: {
          DEFAULT: '#FDF8F0',
          dark: '#F5EBD8',
        },
        background: '#FDF8F0',
        surface: '#FFFFFF',
        muted: '#F3EDE3',
        border: '#E5D5C0',
        text: {
          primary: '#1A0A00',
          secondary: '#5C4A3A',
          light: '#9C8070',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('/hero-bg.png')",
        'gradient-maroon': 'linear-gradient(135deg, #8B1A1A 0%, #C0392B 100%)',
        'gradient-gold': 'linear-gradient(135deg, #C9A84C 0%, #E0BE7A 100%)',
        'gradient-hero': 'linear-gradient(135deg, rgba(107,20,20,0.92) 0%, rgba(43,6,6,0.88) 60%, rgba(139,26,26,0.80) 100%)',
      },
      boxShadow: {
        'warm': '0 4px 20px rgba(139, 26, 26, 0.15)',
        'gold': '0 4px 20px rgba(201, 168, 76, 0.3)',
        'card': '0 2px 15px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 30px rgba(201, 168, 76, 0.4)',
        'glow-lg': '0 0 60px rgba(201, 168, 76, 0.3)',
        'warm-lg': '0 10px 40px rgba(139, 26, 26, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.7s ease-in-out',
        'fade-in-up': 'fadeInUp 0.7s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'scale-in': 'scaleIn 0.5s ease-out',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeInUp: { '0%': { transform: 'translateY(30px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideDown: { '0%': { transform: 'translateY(-10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-12px)' } },
        pulseGold: { '0%, 100%': { boxShadow: '0 0 20px rgba(201,168,76,0.3)' }, '50%': { boxShadow: '0 0 40px rgba(201,168,76,0.6)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        scaleIn: { '0%': { transform: 'scale(0.9)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
      },
    },
  },
  plugins: [],
};
