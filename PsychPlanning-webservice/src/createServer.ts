import Koa from 'koa';
import { getLogger } from './core/logging';
import installRest from './rest';
import { initializeData, shutdownData } from './data';
import type { KoaApplication, PsychplannerAppContext, PsychplannerAppState } from './types/koa';
import installMiddleware from './core/installMiddleware';
import config from 'config';

export interface Server {
  getApp(): KoaApplication,
  start(): Promise<void>,
  stop(): Promise<void>,
}

const PORT = config.get<number>('port');

export default async function createServer(): Promise<Server> {
  const app = new Koa<PsychplannerAppState, PsychplannerAppContext>();

  installMiddleware(app);
  await initializeData();
  installRest(app);

  return {
    getApp() {
      return app;
    },
    start() {
      return new Promise<void>((resolve) => {
        app.listen(PORT);
        getLogger().info(`🚀 Server listening on http://localhost:${PORT}`);
        resolve();
      });
    },
    async stop() {
      app.removeAllListeners();
      await shutdownData();
      getLogger().info('bye');
    },
  };
}
