/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        deepNavy: '#0A0F1E',
        electricBlue: '#2563EB',
        surface: '#1E2A3A',
        accentAmber: '#F59E0B',
      },
      fontFamily: {
        heading: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 30px rgba(37, 99, 235, 0.15)',
      },
      borderRadius: {
        card: '12px',
        control: '8px',
      },
      keyframes: {
        fadeSlide: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        fadeSlide: 'fadeSlide 400ms ease-out',
        shimmer: 'shimmer 1.6s linear infinite',
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at 20% 10%, rgba(37,99,235,0.25), transparent 35%), radial-gradient(circle at 85% 20%, rgba(245,158,11,0.2), transparent 30%), linear-gradient(130deg, #0A0F1E 0%, #111b30 60%, #0f172a 100%)',
      },
    },
  },
  plugins: [],
}
