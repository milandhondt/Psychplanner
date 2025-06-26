import Router from '@koa/router';
import Joi from 'joi';
import validate from '../core/validation';
import * as userService from '../service/user';
import type {
  KoaContext,
  KoaRouter,
  PsychplannerAppContext,
  PsychplannerAppState,
} from '../types/koa';
import type { LoginResponse, LoginRequest } from '../types/user';

/**
 * @api {post} /api/sessions Inloggen
 * @apiName Login
 * @apiGroup Session
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} email Het emailadres van de gebruiker
 * @apiParam {String} password Het wachtwoord van de gebruiker
 * 
 * @apiSuccess {String} token Het JWT-token dat wordt gebruikt voor authenticatie
 * @apiSuccess {Number} status HTTP-statuscode (200)
 */
const login = async (ctx: KoaContext<LoginResponse, void, LoginRequest>) => {
  const { email, password } = ctx.request.body;
  const token = await userService.login(email, password);

  ctx.status = 200;
  ctx.body = { token };
};

login.validationScheme = {
  body: {
    email: Joi.string().email(),
    password: Joi.string(),
  },
};

export default function installSessionRouter(parent: KoaRouter) {
  const router = new Router<PsychplannerAppState, PsychplannerAppContext>({
    prefix: '/sessions',
  });

  router.post('/', validate(login.validationScheme), login);

  parent.use(router.routes()).use(router.allowedMethods());
}
