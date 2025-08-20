import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      black: '#191414',
      grey: '#2E2E2E',
      white: '#FFFFFF',
      'spotify-green': '#1DB954',
      blue: '#2B93DA',
    },
  },
  plugins: [],
};
export default config;
