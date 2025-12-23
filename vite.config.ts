import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Cast process to any to avoid TS error 'Property cwd does not exist on type Process'
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Shims process.env.API_KEY for the frontend to use during build/preview
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});