import Router from '@koa/router';
import * as afspraakService from '../service/afspraak';
import type { KoaContext, KoaRouter, PsychplannerAppContext, PsychplannerAppState } from '../types/koa';
import type {
  CreateAfspraakRequest, CreateAfspraakResponse, GetAfspraakByIdResponse,
  GetAllAfsprakenResponse, UpdateAfspraakRequest, UpdateAfspraakResponse,
} from '../types/afspraak';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import validate from '../core/validation';
import { requireAuthentication } from '../core/auth';

/**
 * @api {get} /afspraken Haal alle afspraken op
 * @apiName GetAllAfspraken
 * @apiGroup Afspraken
 * @apiPermission authenticated
 *
 * @apiSuccess {Object[]} items Lijst van afspraken
 * @apiSuccess {Number} items.id ID van de afspraak
 * @apiSuccess {Number} items.klant_id ID van de klant
 * @apiSuccess {Number} items.psycholoog_id ID van de psycholoog
 * @apiSuccess {Number} items.service_id ID van de service
 * @apiSuccess {String} items.datum Datum van de afspraak
 * @apiSuccess {Boolean} items.formulier_nodig Geeft aan of een formulier nodig is
 * @apiSuccess {String} items.opmerking Optionele opmerking voor de afspraak
 */
const getAllAfspraken = async (ctx: KoaContext<GetAllAfsprakenResponse>) => {
  const afspraken = await afspraakService.getAll();
  ctx.body = {
    items: afspraken,
  };
};

getAllAfspraken.validationScheme = null;

/**
 * @api {get} /afspraken/:id Haal afspraak op op basis van ID
 * @apiName GetAfspraakById
 * @apiGroup Afspraken
 * @apiPermission authenticated
 *
 * @apiParam {Number} id ID van de afspraak
 *
 * @apiSuccess {Number} id ID van de afspraak
 * @apiSuccess {Number} klant_id ID van de klant
 * @apiSuccess {Number} psycholoog_id ID van de psycholoog
 * @apiSuccess {Number} service_id ID van de service
 * @apiSuccess {String} datum Datum van de afspraak
 * @apiSuccess {Boolean} formulier_nodig Geeft aan of een formulier nodig is
 * @apiSuccess {String} opmerking Optionele opmerking voor de afspraak
 */
const getAfspraakById = async (ctx: KoaContext<GetAfspraakByIdResponse, IdParams>) => {
  ctx.body = await afspraakService.getById(ctx.params.id);
};

getAfspraakById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @api {get} /afspraken/psychologen/:id Haal afspraken op voor een specifieke psycholoog
 * @apiName GetAfsprakenByPsycholoogId
 * @apiGroup Afspraken
 * @apiPermission authenticated, psycholoog
 *
 * @apiParam {Number} id ID van de psycholoog
 *
 * @apiSuccess {Object[]} items Lijst van afspraken voor de psycholoog
 * @apiSuccess {Number} items.id ID van de afspraak
 * @apiSuccess {Number} items.klant_id ID van de klant
 * @apiSuccess {Number} items.psycholoog_id ID van de psycholoog
 * @apiSuccess {Number} items.service_id ID van de service
 * @apiSuccess {String} items.datum Datum van de afspraak
 * @apiSuccess {Boolean} items.formulier_nodig Geeft aan of een formulier nodig is
 * @apiSuccess {String} items.opmerking Optionele opmerking voor de afspraak
 */
const getAfsprakenByPsycholoogId = async (ctx: KoaContext<GetAllAfsprakenResponse, IdParams>) => {
  const afspraken = await afspraakService.getAfsprakenByPsycholoogId(ctx.params.id);
  ctx.body = {
    items: afspraken,
  };
};
getAfsprakenByPsycholoogId.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @api {post} /afspraken Maak een nieuwe afspraak
 * @apiName CreateAfspraak
 * @apiGroup Afspraken
 * @apiPermission authenticated
 *
 * @apiParam {Number} klant_id ID van de klant
 * @apiParam {Number} psycholoog_id ID van de psycholoog
 * @apiParam {Number} service_id ID van de service
 * @apiParam {String} datum Datum van de afspraak
 * @apiParam {Boolean} formulier_nodig Geeft aan of een formulier nodig is
 * @apiParam {String} [opmerking] Optionele opmerking voor de afspraak
 *
 * @apiSuccess {Number} id ID van de gemaakte afspraak
 * @apiSuccess {Number} klant_id ID van de klant
 * @apiSuccess {Number} psycholoog_id ID van de psycholoog
 * @apiSuccess {Number} service_id ID van de service
 * @apiSuccess {String} datum Datum van de afspraak
 * @apiSuccess {Boolean} formulier_nodig Geeft aan of een formulier nodig is
 * @apiSuccess {String} opmerking Optionele opmerking voor de afspraak
 */
const createAfspraak = async (ctx: KoaContext<CreateAfspraakResponse, void, CreateAfspraakRequest>) => {
  const afspraak = await afspraakService.create({ ...ctx.request.body });
  ctx.status = 201;
  ctx.body = afspraak;
};

createAfspraak.validationScheme = {
  body: {
    klant_id: Joi.number().integer().positive(),
    psycholoog_id: Joi.number().integer().positive(),
    service_id: Joi.number().integer().positive(),
    datum: Joi.date().iso(),
    formulier_nodig: Joi.boolean(),
    opmerking: Joi.string().optional().allow(''),
  },
};

/**
 * @api {put} /afspraken/:id Update een bestaande afspraak
 * @apiName UpdateAfspraak
 * @apiGroup Afspraken
 * @apiPermission authenticated
 *
 * @apiParam {Number} id ID van de afspraak
 * @apiParam {Number} klant_id ID van de klant
 * @apiParam {Number} psycholoog_id ID van de psycholoog
 * @apiParam {Number} service_id ID van de service
 * @apiParam {String} datum Datum van de afspraak
 * @apiParam {Boolean} formulier_nodig Geeft aan of een formulier nodig is
 * @apiParam {String} [opmerking] Optionele opmerking voor de afspraak
 *
 * @apiSuccess {Number} id ID van de bijgewerkte afspraak
 * @apiSuccess {Number} klant_id ID van de klant
 * @apiSuccess {Number} psycholoog_id ID van de psycholoog
 * @apiSuccess {Number} service_id ID van de service
 * @apiSuccess {String} datum Datum van de afspraak
 * @apiSuccess {Boolean} formulier_nodig Geeft aan of een formulier nodig is
 * @apiSuccess {String} opmerking Optionele opmerking voor de afspraak
 */
const updateAfspraak = async (ctx: KoaContext<UpdateAfspraakResponse, IdParams, UpdateAfspraakRequest>) => {
  ctx.body = await afspraakService.updateById(ctx.params.id, { ...ctx.request.body });
};

updateAfspraak.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    klant_id: Joi.number().integer().positive(),
    psycholoog_id: Joi.number().integer().positive(),
    service_id: Joi.number().integer().positive(),
    datum: Joi.date().iso(),
    formulier_nodig: Joi.boolean(),
    opmerking: Joi.string().optional().allow(''),
  },
};

/**
 * @api {delete} /afspraken/:id Verwijder een afspraak
 * @apiName DeleteAfspraak
 * @apiGroup Afspraken
 * @apiPermission authenticated
 *
 * @apiParam {Number} id ID van de afspraak
 *
 * @apiSuccess {String} status Status van de verwijdering
 */
const deleteAfspraak = async (ctx: KoaContext<void, IdParams>) => {
  afspraakService.deleteById(ctx.params.id);
  ctx.status = 204;
};

deleteAfspraak.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<PsychplannerAppState, PsychplannerAppContext>({
    prefix: '/afspraken',
  });

  router.get('/', requireAuthentication, validate(getAllAfspraken.validationScheme), getAllAfspraken);
  router.get('/psychologen/:id', requireAuthentication, 
    validate(getAfsprakenByPsycholoogId.validationScheme), getAfsprakenByPsycholoogId);
  router.post('/', requireAuthentication, validate(createAfspraak.validationScheme), createAfspraak);
  router.get('/:id', requireAuthentication, validate(getAfspraakById.validationScheme), getAfspraakById);
  router.put('/:id', requireAuthentication, validate(updateAfspraak.validationScheme), updateAfspraak);
  router.delete('/:id', requireAuthentication, validate(deleteAfspraak.validationScheme), deleteAfspraak);

  parent.use(router.routes()).use(router.allowedMethods());
};
