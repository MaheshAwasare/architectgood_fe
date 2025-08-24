/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a9977',
          light: '#2ab987',
          dark: '#0a8967',
          darker: '#0a7957',
        },
        neutral: {
          50: '#f8fafc', // Very light off-white/gray
          100: '#f1f5f9', // Light off-white/gray
          200: '#e2e8f0', // Slightly darker off-white/gray
          300: '#cbd5e1', // Even darker
        },
        accent: {
          50: '#e0f2f7', // Very light blue
          100: '#bae6fd', // Light blue
        }
      },
    },
  },
  plugins: [],
};
