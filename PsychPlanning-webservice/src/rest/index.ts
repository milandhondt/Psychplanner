import Router from '@koa/router';
import installAfspraakRouter from './afspraak';
import installServiceRouter from './service';
import installBeschikbaarheidRouter from './beschikbaarheid';
import installHealthRouter from './health';
import installSessionRouter from './session';
import installUserRouter from './user';
import type { KoaApplication, PsychplannerAppContext, PsychplannerAppState } from '../types/koa';

export default (app: KoaApplication) => {

  const router = new Router<PsychplannerAppState, PsychplannerAppContext>({
    prefix: '/api',
  });

  installAfspraakRouter(router);
  installServiceRouter(router);
  installBeschikbaarheidRouter(router);
  installHealthRouter(router);
  installUserRouter(router);
  installSessionRouter(router);

  app.use(router.routes()).use(router.allowedMethods());

};
