/*
 * Created on Sat Dec 27 2025
 *
 * Copyright (c) 2025 Your Company
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
})