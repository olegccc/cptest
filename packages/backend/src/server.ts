import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { createIntelHandler } from './routes/intel.js';
import { createAbuseIpdbService } from './services/abuseipdb.js';
import { createIpQualityScoreService } from './services/ipqualityscore.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const app = express();

  const frontendRoot = path.resolve(__dirname, '../../frontend');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
    root: frontendRoot,
    css: {
      postcss: path.join(frontendRoot, 'postcss.config.cjs'),
    },
  });

  app.use(vite.middlewares);

  app.use('/api', express.json());

  const abuseIpdbService = createAbuseIpdbService();
  const ipQualityScoreService = createIpQualityScoreService();
  const intelHandler = createIntelHandler(abuseIpdbService, ipQualityScoreService);

  app.get('/api/intel', intelHandler);

  const indexPath = path.resolve(__dirname, '../../frontend/index.html');
  const template = await fs.readFile(indexPath, 'utf-8');

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const html = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  const port = parseInt(process.env.PORT || '3000', 10);
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

createServer().catch(console.error);
