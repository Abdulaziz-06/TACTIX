import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'three/build/three.module.js': 'three',
      '@luma.gl/core': path.resolve(__dirname, 'node_modules/@luma.gl/core'),
      '@deck.gl/core': path.resolve(__dirname, 'node_modules/@deck.gl/core'),
    },
  },
  optimizeDeps: {
    include: ['date-fns', 'three', 'three-globe', '@deck.gl/core', '@deck.gl/layers', '@deck.gl/react'],
    exclude: ['@deck.gl/widgets'], // Externalize to avoid bundling issues if missing
    esbuildOptions: {
      target: 'esnext',
      supported: {
        'top-level-await': true
      }
    }
  },
  build: {
    target: 'esnext'
  },
  server: {
    fs: {
      strict: false
    }
  },
  plugins: [
    react(),
    {
      name: 'market-data-proxy',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const url = new URL(req.url || '', `http://${req.headers.host}`);
          if (url.pathname === '/api/market/v1/list-commodity-quotes') {
            try {
              const symbolsParam = url.searchParams.get('symbols') || '';
              const symbols = symbolsParam.split(',').map(s => s.trim()).filter(Boolean);
              
              const quotes = await Promise.all(symbols.map(async (sym) => {
                try {
                  const yfRes = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=5d`, {
                    headers: { 'User-Agent': 'Mozilla/5.0' }
                  });
                  if (!yfRes.ok) return { symbol: sym, price: null, change: null, sparkline: [] };
                  const data: any = await yfRes.json();
                  const meta = data?.chart?.result?.[0]?.meta;
                  if (!meta) return { symbol: sym, price: null, change: null, sparkline: [] };

                  const price = meta.regularMarketPrice ?? null;
                  const prev = meta.previousClose ?? meta.chartPreviousClose ?? price;
                  const change = prev && price != null ? ((price - prev) / prev) * 100 : 0;

                  const closeSeries = data?.chart?.result?.[0]?.indicators?.quote?.[0]?.close || [];
                  const validPoints: number[] = closeSeries.filter((p: any) => typeof p === 'number' && !isNaN(p));

                  return {
                    symbol: sym,
                    price,
                    change,
                    previousClose: prev,
                    sparkline: validPoints.length > 0 ? validPoints : [price, price],
                    currency: meta.currency || 'INR',
                    lastUpdated: meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toISOString() : new Date().toISOString()
                  };
                } catch (e) {
                  return { symbol: sym, price: null, change: null, sparkline: [] };
                }
              }));

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ quotes }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
            return;
          }
          next();
        });
      }
    }
  ]
})
