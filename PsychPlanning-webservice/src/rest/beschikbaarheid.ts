import Router from '@koa/router';
import * as beschikbaarheidService from '../service/beschikbaarheid';
import type { IdParams } from '../types/common';
import type { KoaContext, KoaRouter, PsychplannerAppContext, PsychplannerAppState } from '../types/koa';
import type {
  CreateBeschikbaarheidRequest, CreateBeschikbaarheidResponse, GetAllBeschikbaarhedenResponse,
  GetBeschikbaarheidByIdResponse, UpdateBeschikbaarheidRequest, UpdateBeschikbaarheidResponse,
} from '../types/beschikbaarheid';
import Joi from 'joi';
import validate from '../core/validation';
import { requireAuthentication } from '../core/auth';

/**
 * @api {get} /beschikbaarheden Haal alle beschikbaarheden op
 * @apiName GetAllBeschikbaarheden
 * @apiGroup Beschikbaarheden
 * @apiPermission authenticated
 *
 * @apiSuccess {Object[]} items Lijst van beschikbaarheden
 * @apiSuccess {Number} items.id ID van de beschikbaarheid
 * @apiSuccess {Number} items.psycholoog_id ID van de psycholoog
 * @apiSuccess {String} items.datum_start Startdatum van de beschikbaarheid
 * @apiSuccess {String} items.datum_eind Einddatum van de beschikbaarheid
 */
const getAllBeschikbaarheden = async (ctx: KoaContext<GetAllBeschikbaarhedenResponse>) => {
  const beschikbaarheden = await beschikbaarheidService.getAll();
  ctx.body = {
    items: beschikbaarheden,
  };
};

getAllBeschikbaarheden.validationScheme = null;

/**
 * @api {get} /beschikbaarheden/:id Haal beschikbaarheid op op basis van ID
 * @apiName GetBeschikbaarheidById
 * @apiGroup Beschikbaarheden
 * @apiPermission authenticated
 *
 * @apiParam {Number} id ID van de beschikbaarheid
 *
 * @apiSuccess {Number} id ID van de beschikbaarheid
 * @apiSuccess {Number} psycholoog_id ID van de psycholoog
 * @apiSuccess {String} datum_start Startdatum van de beschikbaarheid
 * @apiSuccess {String} datum_eind Einddatum van de beschikbaarheid
 */
const getBeschikbaarheidById = async (ctx: KoaContext<GetBeschikbaarheidByIdResponse, IdParams>) => {
  ctx.body = await beschikbaarheidService.getById(ctx.params.id);
};

getBeschikbaarheidById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @api {post} /beschikbaarheden Maak een nieuwe beschikbaarheid aan
 * @apiName CreateBeschikbaarheid
 * @apiGroup Beschikbaarheden
 * @apiPermission authenticated
 *
 * @apiParam {Number} psycholoog_id ID van de psycholoog
 * @apiParam {String} datum_start Startdatum van de beschikbaarheid
 * @apiParam {String} datum_eind Einddatum van de beschikbaarheid
 *
 * @apiSuccess {Number} id ID van de gemaakte beschikbaarheid
 * @apiSuccess {Number} psycholoog_id ID van de psycholoog
 * @apiSuccess {String} datum_start Startdatum van de beschikbaarheid
 * @apiSuccess {String} datum_eind Einddatum van de beschikbaarheid
 */
const createBeschikbaarheid = async (ctx: KoaContext<CreateBeschikbaarheidResponse,
  void, CreateBeschikbaarheidRequest>) => {
  const beschikbaarheid = await beschikbaarheidService.create({ ...ctx.request.body });
  ctx.status = 201;
  ctx.body = beschikbaarheid;
};

createBeschikbaarheid.validationScheme = {
  body: {
    psycholoog_id: Joi.number().integer().positive(),
    datum_start: Joi.date().iso(),
    datum_eind: Joi.date().iso().greater(Joi.ref('datum_start')),
  },
};

/**
 * @api {put} /beschikbaarheden/:id Update een bestaande beschikbaarheid
 * @apiName UpdateBeschikbaarheid
 * @apiGroup Beschikbaarheden
 * @apiPermission authenticated
 *
 * @apiParam {Number} id ID van de beschikbaarheid
 * @apiParam {Number} psycholoog_id ID van de psycholoog
 * @apiParam {String} datum_start Startdatum van de beschikbaarheid
 * @apiParam {String} datum_eind Einddatum van de beschikbaarheid
 *
 * @apiSuccess {Number} id ID van de bijgewerkte beschikbaarheid
 * @apiSuccess {Number} psycholoog_id ID van de psycholoog
 * @apiSuccess {String} datum_start Startdatum van de beschikbaarheid
 * @apiSuccess {String} datum_eind Einddatum van de beschikbaarheid
 */
const updateBeschikbaarheid = async (ctx: KoaContext<UpdateBeschikbaarheidResponse,
  IdParams, UpdateBeschikbaarheidRequest>) => {
  ctx.body = await beschikbaarheidService.updateById(ctx.params.id, { ...ctx.request.body });
};

updateBeschikbaarheid.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    psycholoog_id: Joi.number().integer().positive(),
    datum_start: Joi.date().iso(),
    datum_eind: Joi.date().iso().greater(Joi.ref('datum_start')),
  },
};

/**
 * @api {delete} /beschikbaarheden/:id Verwijder een beschikbaarheid
 * @apiName DeleteBeschikbaarheid
 * @apiGroup Beschikbaarheden
 * @apiPermission authenticated
 *
 * @apiParam {Number} id ID van de beschikbaarheid
 *
 * @apiSuccess {String} status Status van de verwijdering
 */
const deleteBeschikbaarheid = async (ctx: KoaContext<void, IdParams>) => {
  await beschikbaarheidService.deleteById(ctx.params.id);
  ctx.status = 204;
};

deleteBeschikbaarheid.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<PsychplannerAppState, PsychplannerAppContext>({
    prefix: '/beschikbaarheden',
  });

  router.get('/', requireAuthentication, validate(getAllBeschikbaarheden.validationScheme), getAllBeschikbaarheden);
  router.post('/', requireAuthentication, validate(createBeschikbaarheid.validationScheme), createBeschikbaarheid);
  router.get('/:id', requireAuthentication, validate(getBeschikbaarheidById.validationScheme), getBeschikbaarheidById);
  router.put('/:id', requireAuthentication, validate(updateBeschikbaarheid.validationScheme), updateBeschikbaarheid);
  router.delete('/:id', requireAuthentication, validate(deleteBeschikbaarheid.validationScheme), deleteBeschikbaarheid);

  parent.use(router.routes()).use(router.allowedMethods());
};
