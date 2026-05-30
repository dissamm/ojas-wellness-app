import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Base/Neutral
        'ojas-bg': {
          primary: '#0F0F0F',
          secondary: '#1A1A1A',
          tertiary: '#2D2D2D',
        },
        'ojas-text': {
          primary: '#F5F1ED',
          secondary: '#A8A8A8',
        },
        
        // Phase-Specific Accent Colors
        'ojas-menstrual': '#1a0a2e',
        'ojas-follicular': '#c06080',
        'ojas-ovulation': '#FF6B9D',
        'ojas-luteal': '#B8A8D8',
      },

      backgroundImage: {
        // Phase Gradients
        'gradient-menstrual': 'linear-gradient(135deg, #2D1B2E 0%, #1A1A1A 100%)',
        'gradient-follicular': 'linear-gradient(135deg, #8B9D6E 0%, #F5F1ED 100%)',
        'gradient-ovulation': 'linear-gradient(135deg, #FFD700 0%, #FFF8DC 100%)',
        'gradient-luteal': 'linear-gradient(135deg, #6B4E9C 0%, #1A1F3A 100%)',
      },

      fontFamily: {
        // Serif for headings (poetic)
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        // Sans for body (readable)
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        'h1': '42px',
        'h2': '32px',
        'h3': '24px',
        'h4': '20px',
        'h5': '18px',
        'h6': '16px',
        'body': '16px',
        'caption': '14px',
      },

      boxShadow: {
        'sm': '0 4px 16px rgba(0,0,0,0.2)',
        'md': '0 8px 32px rgba(0,0,0,0.3)',
        'lg': '0 12px 48px rgba(0,0,0,0.4)',
      },

      borderRadius: {
        'card': '24px',
        'button': '50px',
        'input': '12px',
      },

      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        glow: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.7',
          },
        },
      },

      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },

      backdropBlur: {
        'xl': '10px',
      },
    },
  },
  plugins: [],
};
export default config;
