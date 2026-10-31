
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4000'
    }
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'pdf-worker': ['pdfjs-dist'],
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      // Leave files over the precache limit out of the offline cache with a
      // warning instead of failing the build. Large features such as the
      // Excalidraw whiteboard load on demand and do not belong in the cache.
      showMaximumFileSizeToCacheInBytesWarning: true,
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg', 'icon.svg'],
      manifest: {
        name: 'SlimFile - File Compressor',
        short_name: 'SlimFile',
        description: 'Compress PDF and image files easily',
        theme_color: '#ef4444',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        // Precache only the core app: the main bundles, styles, page shell and
        // icons. The whiteboard and document editors (and Excalidraw's diagram
        // code) are large and load on demand; precaching them made every
        // visitor download over 20 MB up front.
        globPatterns: [
          '**/*.{css,html,ico,png,svg}',
          'assets/index-*.js',
          'assets/*-vendor-*.js',
        ],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB
        skipWaiting: true, // Auto-activate new service worker
        clientsClaim: true, // Take control immediately
        cleanupOutdatedCaches: true, // Remove old caches
        runtimeCaching: [
          // Lazily loaded chunks are cached the first time they are used.
          // Their names are content-hashed, so a cached copy never goes stale.
          {
            urlPattern: ({ url }) => url.origin === self.location.origin && url.pathname.startsWith('/assets/') && url.pathname.endsWith('.js'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'lazy-chunks',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 60 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              }
            }
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
