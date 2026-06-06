/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{jsx,tsx}',
    './src/**/*.{mjs,js}',
    './bin/**/*.mjs'
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#fffdf6',
          100: '#f7f2e8',
          200: '#e7decc',
          300: '#d6c7ae'
        },
        ink: {
          900: '#111318',
          800: '#1a1d24',
          700: '#2a2d34',
          500: '#686d6a',
          300: '#a9aaa3'
        },
        signal: {
          blue: '#185cff',
          copper: '#b86a22',
          green: '#167b55',
          red: '#c2351f'
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '"Noto Sans CJK SC"',
          '"Noto Sans SC"',
          '"PingFang SC"',
          '"Microsoft YaHei"',
          'Arial',
          'sans-serif'
        ],
        mono: [
          '"SFMono-Regular"',
          'Consolas',
          '"Liberation Mono"',
          'monospace'
        ]
      },
      boxShadow: {
        plate: '0 24px 80px rgba(17, 19, 24, 0.08)'
      }
    }
  },
  plugins: []
};
