/*
 * Created on Sat Dec 27 2025
 *
 * Copyright (c) 2025 Your Company
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}", // HANYA .js karena kita rename semua
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors (TFMS identity)
        navy: {
          50: '#f0f4ff',
          100: '#dce4ff',
          200: '#c1d1ff',
          300: '#9ab4ff',
          400: '#728eff',
          500: '#1E3A8A',    // Primary navy (anchor)
          600: '#172554',
          700: '#0F1A3D',
          800: '#0A1126',
          900: '#050A15',
        },
        
        // Status colors (safety signals - tetap solid)
        status: {
          normal: '#059669',   // Green (tidak neon)
          warning: '#D97706',  // Amber/orange
          danger: '#DC2626',   // Red tegas
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      }
    },
  },
  plugins: [],
};