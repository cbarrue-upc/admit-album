const config = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      colors: {
        hud: 'rgba(0,0,0,0.65)'
      }
    },
  },
  plugins: [],
};

module.exports = config;
