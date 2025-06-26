import Router from '@koa/router';
import * as serviceService from '../service/service';
import type { KoaContext, KoaRouter, PsychplannerAppContext, PsychplannerAppState } from '../types/koa';
import type { IdParams } from '../types/common';
import type {
  CreateServiceRequest, CreateServiceResponse, GetAllServicesResponse,
  GetServiceByIdResponse, UpdateServiceRequest, UpdateServiceResponse,
} from '../types/service';
import Joi from 'joi';
import validate from '../core/validation';
import { requireAuthentication } from '../core/auth';

/**
 * @api {get} /api/services Haal een lijst van services op
 * @apiName GetAllServices
 * @apiGroup Service
 * @apiVersion 1.0.0
 * 
 * @apiSuccess {Object[]} items Lijst van services
 * @apiSuccess {Number} items.id ID van de service
 * @apiSuccess {String} items.naam Naam van de service
 * @apiSuccess {Number} items.duur Duur van de service (in minuten)
 * @apiSuccess {Number} items.prijs Prijs van de service
 * @apiSuccess {String} items.beschrijving Beschrijving van de service
 * @apiSuccess {Number} status HTTP-statuscode (200)
 */
const getAllServices = async (ctx: KoaContext<GetAllServicesResponse>) => {
  const services = await serviceService.getAll();
  ctx.body = {
    items: services,
  };
};

getAllServices.validationScheme = null;

/**
 * @api {get} /api/services/:id Haal een service op via ID
 * @apiName GetServiceById
 * @apiGroup Service
 * @apiVersion 1.0.0
 * 
 * @apiParam {Number} id ID van de service
 * 
 * @apiSuccess {Number} id ID van de service
 * @apiSuccess {String} naam Naam van de service
 * @apiSuccess {Number} duur Duur van de service (in minuten)
 * @apiSuccess {Number} prijs Prijs van de service
 * @apiSuccess {String} beschrijving Beschrijving van de service
 * @apiSuccess {Number} status HTTP-statuscode (200)
 */
const getServiceById = async (ctx: KoaContext<GetServiceByIdResponse, IdParams>) => {
  ctx.body = await serviceService.getById(ctx.params.id);
};

getServiceById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @api {post} /api/services Maak een nieuwe service aan
 * @apiName CreateService
 * @apiGroup Service
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} naam Naam van de service
 * @apiParam {Number} duur Duur van de service (in minuten)
 * @apiParam {Number} prijs Prijs van de service
 * @apiParam {String} beschrijving Beschrijving van de service
 * 
 * @apiSuccess {Number} id ID van de aangemaakte service
 * @apiSuccess {String} naam Naam van de service
 * @apiSuccess {Number} duur Duur van de service (in minuten)
 * @apiSuccess {Number} prijs Prijs van de service
 * @apiSuccess {String} beschrijving Beschrijving van de service
 * @apiSuccess {Number} status HTTP-statuscode (201)
 */
const createService = async (ctx: KoaContext<CreateServiceResponse, void, CreateServiceRequest>) => {
  const service = await serviceService.create({ ...ctx.request.body });
  ctx.status = 201;
  ctx.body = service;
};

createService.validationScheme = {
  body: {
    naam: Joi.string(),
    duur: Joi.number().integer().positive().invalid(0),
    prijs: Joi.number().positive().invalid(0),
    beschrijving: Joi.string(),
  },
};

/**
 * @api {put} /api/services/:id Werk een bestaande service bij
 * @apiName UpdateService
 * @apiGroup Service
 * @apiVersion 1.0.0
 * 
 * @apiParam {Number} id ID van de service
 * @apiParam {String} naam Naam van de service
 * @apiParam {Number} duur Duur van de service (in minuten)
 * @apiParam {Number} prijs Prijs van de service
 * @apiParam {String} beschrijving Beschrijving van de service
 * 
 * @apiSuccess {Number} id ID van de bijgewerkte service
 * @apiSuccess {String} naam Naam van de service
 * @apiSuccess {Number} duur Duur van de service (in minuten)
 * @apiSuccess {Number} prijs Prijs van de service
 * @apiSuccess {String} beschrijving Beschrijving van de service
 * @apiSuccess {Number} status HTTP-statuscode (200)
 */
const updateService = async (ctx: KoaContext<UpdateServiceResponse, IdParams, UpdateServiceRequest>) => {
  ctx.body = await serviceService.updateById(ctx.params.id, { ...ctx.request.body });
};

updateService.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    naam: Joi.string(),
    duur: Joi.number().integer().positive().invalid(0),
    prijs: Joi.number().positive().invalid(0),
    beschrijving: Joi.string(),
  },
};

/**
 * @api {delete} /api/services/:id Verwijder een service
 * @apiName DeleteService
 * @apiGroup Service
 * @apiVersion 1.0.0
 * 
 * @apiParam {Number} id ID van de service
 * 
 * @apiSuccess {Number} status HTTP-statuscode (204)
 */
const deleteService = async (ctx: KoaContext<void, IdParams>) => {
  await serviceService.deleteById(ctx.params.id);
  ctx.status = 204;
};

deleteService.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<PsychplannerAppState, PsychplannerAppContext>({
    prefix: '/services',
  });

  router.get('/', validate(getAllServices.validationScheme), getAllServices); 
  router.post('/', requireAuthentication, validate(createService.validationScheme), createService);
  router.get('/:id', requireAuthentication, validate(getServiceById.validationScheme), getServiceById);
  router.put('/:id', requireAuthentication, validate(updateService.validationScheme), updateService);
  router.delete('/:id', requireAuthentication, validate(deleteService.validationScheme), deleteService);

  parent.use(router.routes()).use(router.allowedMethods());
};
