/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Pretos quentes do KV (fundo das peças)
        noir: {
          950: '#070706',
          900: '#0c0b0a',
          800: '#141311',
          700: '#1c1a17',
          600: '#26231f',
        },
        // Amarelo da marca Barbearia VIP (logo / destaques)
        gold: {
          light: '#f6cf3f',
          DEFAULT: '#ebb903',
          dim: '#c49a02',
        },
        // Verde do app Barbearia VIP
        app: {
          DEFAULT: '#00a859',
          deep: '#003b1c',
        },
        smoke: {
          100: '#f5f3ef',
          300: '#d9d5cd',
          500: '#aaa59c',
          700: '#78746d',
        },
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        '10xl': ['10rem', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
        '9xl': ['8rem', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
        '8xl': ['6rem', { lineHeight: '0.92', letterSpacing: '-0.03em' }],
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee 30s linear infinite reverse',
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
      },
    },
  },
}
