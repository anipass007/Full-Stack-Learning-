/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#17192B',
        surface: '#24264A',
        'surface-raised': '#2D305C',
        line: 'rgba(248, 250, 252, 0.09)',
        brand: '#8B5CF6',
        'brand-hover': '#7C3AED',
        'brand-soft': '#A78BFA',
        accent: '#60A5FA',
        success: '#34D399',
        warning: '#FBBF24',
        danger: '#F87171',
        ink: '#F8FAFC',
        'ink-muted': '#B4B8D6',
        'ink-faint': '#8286AA',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 0 rgba(255,255,255,0.04) inset, 0 10px 28px -14px rgba(0,0,0,0.55)',
        pop: '0 18px 48px -12px rgba(0,0,0,0.65)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #60A5FA 100%)',
      },
    },
  },
  plugins: [],
}
