```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  // Configure build output directory if needed, but default is usually fine for Vercel.
  // build: {
  //   outDir: 'dist',
  // },
  // If you encounter issues with paths, you might need to specify the server port,
  // but Vite usually handles this dynamically.
  // server: {
  //   port: 5173, // Or any other port Vite uses by default
  // },
});
```
