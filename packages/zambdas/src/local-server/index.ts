import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import billingZambdasSpec from '../../../../config/billing-app-core/zambdas.json';
import zambdasSpec from '../../../../config/oystehr-core/zambdas.json';
import { expressLambda } from './utils';

const app = express();

app.use(express.text({ type: '*/*', limit: '6mb' }));

// Upgrade lower-cased authorization into capitalized one the way API Gateway does
app.use((req: Request, _res: Response, next: NextFunction) => {
  req.headers.Authorization = req.headers.authorization;
  next();
});

app.use(cors());

// Register routes lazily to avoid Vite SSR import issues during module initialization
function registerRoutes(): void {
  // Mock endpoints for local auth and user resolution
  app.get(['/user/me', '/v1/user/me'], (_req: Request, res: Response) => {
    res.json({
      id: 'local-admin-user',
      name: 'Dr. Brasil (Admin)',
      email: 'admin@ottehr.com.br',
      roles: [{ name: 'Administrator' }, { name: 'Provider' }, { name: 'Staff' }],
      profile: 'Practitioner/local-admin-practitioner',
    });
  });

  app.post('/oauth/token', (_req: Request, res: Response) => {
    res.json({
      access_token: 'local-m2m-token-for-dev',
      token_type: 'Bearer',
      expires_in: 86400,
    });
  });

  app.get('/healthcheck', (_req: Request, res: Response) => {
    res.json({ ok: true, service: 'ottehr-br-api' });
  });

  Object.entries({ ...zambdasSpec.zambdas, ...billingZambdasSpec.zambdas }).forEach(([_key, spec]) => {
    const executeOrExecutePublic = spec.type === 'http_auth' ? 'execute' : 'execute-public';
    const paths = [
      `/local/zambda/${spec.name}/${executeOrExecutePublic}`,
      `/zambda/${spec.name}/${executeOrExecutePublic}`,
      `/${spec.name}/${executeOrExecutePublic}`,
    ];

    paths.forEach((path) => {
      app.post(path, async (req, res) => {
        const { index } = await import(`../../${spec.src}`);
        await expressLambda(index, req, res);
      });
    });

    app.head('/', async (_req, res) => {
      res.send({
        status: 200,
      });
    });
  });
  console.log(`Registered routes for ${Object.keys(zambdasSpec.zambdas).length} Zambdas successfully`);
}

// Register routes immediately (will be called by tests or when server starts)
registerRoutes();

// Only start the server if not in test environment
if (process.env.VITEST !== 'true') {
  // Port defaults to 3000; override with PORT so an ephemeral server (e.g. the
  // daily-census cron) can run on a dedicated port without colliding with the
  // interactive dev server on 3000.
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => {
    console.log(`Zambda local server is running on port ${port}`);
  });
}

export default app;
