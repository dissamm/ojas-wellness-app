import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  safelist: ['md:block', 'md:hidden', 'hidden', 'block'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-container-low": "#f5f3ef",
        "error-container": "#ffdad6",
        "secondary-fixed-dim": "#fbb2c7",
        "on-primary": "#ffffff",
        "surface-variant": "#e4e2de",
        "surface-container-high": "#eae8e4",
        "on-error": "#ffffff",
        "on-surface-variant": "#404942",
        "surface-container-lowest": "#ffffff",
        "on-primary-fixed-variant": "#085230",
        "tertiary-fixed-dim": "#ffafd7",
        "background": "#fbf9f5",
        "surface-container-highest": "#e4e2de",
        "secondary": "#864d5f",
        "outline-variant": "#bfc9bf",
        "on-secondary-fixed-variant": "#6b3648",
        "secondary-fixed": "#ffd9e2",
        "on-tertiary-container": "#ff87c9",
        "tertiary-fixed": "#ffd8e9",
        "tertiary-container": "#82005b",
        "on-surface": "#1b1c1a",
        "on-secondary-container": "#7b4355",
        "on-primary-container": "#7bbd93",
        "surface-tint": "#296a46",
        "error": "#ba1a1a",
        "on-secondary": "#ffffff",
        "inverse-primary": "#92d5a9",
        "surface-container": "#efeeea",
        "on-background": "#1b1c1a",
        "outline": "#707971",
        "surface": "#fbf9f5",
        "inverse-on-surface": "#f2f0ed",
        "on-primary-fixed": "#002110",
        "on-tertiary-fixed-variant": "#880660",
        "surface-bright": "#fbf9f5",
        "primary": "#00341c",
        "inverse-surface": "#30312e",
        "tertiary": "#5a003e",
        "primary-fixed": "#aef2c4",
        "surface-dim": "#dbdad6",
        "on-error-container": "#93000a",
        "secondary-container": "#feb5ca",
        "on-secondary-fixed": "#360b1d",
        "on-tertiary": "#ffffff",
        "primary-container": "#004d2c",
        "primary-fixed-dim": "#92d5a9",
        "on-tertiary-fixed": "#3c0028",

        // Keeping these for backwards compatibility until refactoring is complete
        'ojas-green': {
          dark: '#003D22',
          DEFAULT: '#004D2C',
          light: '#EAF5EE',
        },
        'ojas-cream': '#F5F0E8',
        'ojas-pink': {
          DEFAULT: '#FFB6CB',
          light: '#FEF0F5',
        },
        'ojas-menstrual': '#1a0a2e',
        'ojas-follicular': '#c06080',
        'ojas-ovulation': '#FF6B9D',
        'ojas-luteal': '#B8A8D8',
      },

      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem",
        'card': '24px',
        'button': '50px',
        'input': '12px',
      },

      spacing: {
        "stack-sm": "12px",
        "margin-mobile": "20px",
        "container-max": "1280px",
        "stack-xl": "80px",
        "unit": "8px",
        "margin-desktop": "64px",
        "gutter": "24px",
        "stack-lg": "48px",
        "stack-md": "24px"
      },

      fontFamily: {
        "body-lg": ["EB Garamond", "serif"],
        "headline-md": ["Notable", "sans-serif"],
        "label-md": ["Space Mono", "monospace"],
        "quote": ["EB Garamond", "serif"],
        "display-lg": ["Notable", "sans-serif"],
        "display-lg-mobile": ["Notable", "sans-serif"],
        "headline-sm": ["Notable", "sans-serif"],
        "body-md": ["EB Garamond", "serif"],
        "label-caps": ["Space Mono", "monospace"],
        
        // Legacy
        bebas: ['"Bebas Neue"', 'sans-serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        "body-lg": ["20px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "headline-md": ["32px", {"lineHeight": "1.2", "fontWeight": "400"}],
        "label-md": ["14px", {"lineHeight": "1.4", "fontWeight": "400"}],
        "quote": ["24px", {"lineHeight": "1.5", "fontWeight": "400"}],
        "display-lg": ["64px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "400"}],
        "display-lg-mobile": ["40px", {"lineHeight": "1.1", "fontWeight": "400"}],
        "headline-sm": ["24px", {"lineHeight": "1.2", "fontWeight": "400"}],
        "body-md": ["17px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "label-caps": ["12px", {"lineHeight": "1.4", "letterSpacing": "0.1em", "fontWeight": "700"}],
      },

      backgroundImage: {
        'gradient-menstrual': 'linear-gradient(135deg, #2D1B2E 0%, #1A1A1A 100%)',
        'gradient-follicular': 'linear-gradient(135deg, #8B9D6E 0%, #F5F1ED 100%)',
        'gradient-ovulation': 'linear-gradient(135deg, #FFD700 0%, #FFF8DC 100%)',
        'gradient-luteal': 'linear-gradient(135deg, #6B4E9C 0%, #1A1F3A 100%)',
      },

      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'fade-rise': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        dash: {
          to: { strokeDashoffset: '0' },
        },
        'lotus-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
        },
        'divider-grow': {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
        'dot-pulse': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.3)' },
        }
      },

      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'fade-rise': 'fade-rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        'dash': 'dash 5s linear forwards infinite',
        'lotus-pulse': 'lotus-pulse 3s ease-in-out infinite',
        'divider-grow': 'divider-grow 1s cubic-bezier(0.16,1,0.3,1) both',
        'dot-pulse': 'dot-pulse 2.5s ease-in-out infinite',
      },

      backdropBlur: {
        'xl': '10px',
      },
    },
  },
  plugins: [],
};
export default config;
