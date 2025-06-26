import Router from '@koa/router';
import * as healthService from '../service/health';
import type { Context } from 'koa';
import type { KoaRouter, PsychplannerAppContext, PsychplannerAppState } from '../types/koa';

/**
 * @api {get} /health/ping Controleer of de server werkt
 * @apiName Ping
 * @apiGroup Health
 *
 * @apiSuccess {String} message Bericht dat de server actief is
 * @apiSuccess {Number} status HTTP-statuscode (200)
 */
const ping = async (ctx: Context) => {
  ctx.status = 200;
  ctx.body = healthService.ping();
};

/**
 * @api {get} /health/version Haal de versie van de API op
 * @apiName GetVersion
 * @apiGroup Health
 *
 * @apiSuccess {String} version Versie van de API
 * @apiSuccess {Number} status HTTP-statuscode (200)
 */

const getVersion = async (ctx: Context) => {
  ctx.status = 200;
  ctx.body = healthService.getVersion();
};

export default (parent: KoaRouter) => {
  const router = new Router<PsychplannerAppState, PsychplannerAppContext>({
    prefix: '/health',
  });

  router.get('/ping', ping);
  router.get('/version', getVersion);

  parent.use(router.routes()).use(router.allowedMethods());
};
