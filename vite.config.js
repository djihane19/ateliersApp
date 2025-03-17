import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'], // Separate React-related code
          pdf: ['html2pdf.js'], // Separate pdf library
        }
      }
    },
    chunkSizeWarningLimit: 800, // Adjust limit if needed
  }
});
      