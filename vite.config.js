import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
 
export default {
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true, // Ensures Vite doesn't try to use another port if 5173 is occupied
  },   
};