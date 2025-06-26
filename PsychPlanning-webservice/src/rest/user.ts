import Router from '@koa/router';
import Joi from 'joi';
import * as userService from '../service/user';
import * as afsprakenService from '../service/afspraak';
import * as beschikbaarheidsService from '../service/beschikbaarheid';
import * as serviceService from '../service/service';
import type { PsychplannerAppContext, PsychplannerAppState } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type { IdParams } from '../types/common';
import type { GetAllBeschikbaarhedenResponse } from '../types/beschikbaarheid';
import type { GetAllAfsprakenResponse } from '../types/afspraak';
import type { GetAllServicesResponse } from '../types/service';
import type {
  CreateUserRequest,
  GetAllUsersResponse,
  GetUserByIdResponse,
  LoginResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  GetUserRequest,
} from '../types/user';
import validate from '../core/validation';
import { requireAuthentication, makeRequireRole } from '../core/auth';
import Role from '../core/roles';

/**
 * @api {get} /api/users Haal alle gebruikers op
 * @apiName GetAllUsers
 * @apiGroup User
 * @apiVersion 1.0.0
 * 
 * @apiSuccess {Object[]} items Lijst van alle gebruikers
 * @apiSuccess {Number} items.id Gebruikers-ID
 * @apiSuccess {String} items.voornaam Voornaam van de gebruiker
 * @apiSuccess {String} items.naam Achternaam van de gebruiker
 * @apiSuccess {String} items.email E-mailadres van de gebruiker
 * @apiSuccess {String} items.telefoon Telefoonnummer van de gebruiker
 * @apiSuccess {String} items.straat Straatnaam van de gebruiker
 * @apiSuccess {String} items.stad Stad van de gebruiker
 * @apiSuccess {Number} items.nr Huisnummer van de gebruiker
 * @apiSuccess {Number} items.postcode Postcode van de gebruiker
 * @apiSuccess {Date} items.geboortedatum Geboortedatum van de gebruiker
 * @apiSuccess {String} items.huisarts Naam van de huisarts van de gebruiker
 * @apiSuccess {String[]} items.roles Rollen van de gebruiker
 * 
 * @apiHeader {String} Authorization Bearer token voor authenticatie
 */
const getAllUsers = async (ctx: KoaContext<GetAllUsersResponse>) => {
  const users = await userService.getAll();
  ctx.body = { items: users };
};
getAllUsers.validationScheme = null;

/**
 * @api {post} /api/users Maak een nieuwe gebruiker aan
 * @apiName CreateUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} voornaam Voornaam van de gebruiker
 * @apiParam {String} naam Achternaam van de gebruiker
 * @apiParam {String} email E-mailadres van de gebruiker
 * @apiParam {String} telefoon Telefoonnummer van de gebruiker
 * @apiParam {String} password Wachtwoord van de gebruiker
 * @apiParam {String} [straat] Straatnaam van de gebruiker
 * @apiParam {String} [stad] Stad van de gebruiker
 * @apiParam {Number} [nr] Huisnummer van de gebruiker
 * @apiParam {Number} [postcode] Postcode van de gebruiker
 * @apiParam {Date} [geboortedatum] Geboortedatum van de gebruiker
 * @apiParam {String} [huisarts] Naam van de huisarts van de gebruiker
 * @apiParam {String[]} [roles] Rollen van de gebruiker
 * 
 * @apiSuccess {String} token JWT-token voor de gebruiker
 * 
 * @apiHeader {String} Authorization Bearer token voor authenticatie
 */

const createUser = async (ctx: KoaContext<LoginResponse, void, CreateUserRequest>) => {
  const token = await userService.register(ctx.request.body);
  ctx.status = 200;
  ctx.body = { token };
};
createUser.validationScheme = {
  body: {
    voornaam: Joi.string().min(2).max(100),
    naam: Joi.string().min(2).max(100),
    email: Joi.string().email(),
    telefoon: Joi.string().pattern(/^\+?[0-9\s\-()]{7,20}$/),
    password: Joi.string().min(8),
    straat: Joi.string().allow(''),
    stad: Joi.string().allow(''),
    nr: Joi.number().allow(''),
    postcode: Joi.number().allow(''),
    geboortedatum: Joi.date().allow(''),
    huisarts: Joi.string().allow(''),
    roles: Joi.array(),
  },
};

/**
 * @api {get} /api/users/:id Haal een gebruiker op door ID
 * @apiName GetUserById
 * @apiGroup User
 * @apiVersion 1.0.0
 * 
 * @apiParam {Number=me} id ID van de gebruiker of 'me' voor de ingelogde gebruiker
 * 
 * @apiSuccess {Object} user Gegevens van de gebruiker
 * @apiSuccess {Number} user.id Gebruikers-ID
 * @apiSuccess {String} user.voornaam Voornaam van de gebruiker
 * @apiSuccess {String} user.naam Achternaam van de gebruiker
 * @apiSuccess {String} user.email E-mailadres van de gebruiker
 * @apiSuccess {String} user.telefoon Telefoonnummer van de gebruiker
 * @apiSuccess {String} user.straat Straatnaam van de gebruiker
 * @apiSuccess {String} user.stad Stad van de gebruiker
 * @apiSuccess {Number} user.nr Huisnummer van de gebruiker
 * @apiSuccess {Number} user.postcode Postcode van de gebruiker
 * @apiSuccess {Date} user.geboortedatum Geboortedatum van de gebruiker
 * @apiSuccess {String} user.huisarts Naam van de huisarts van de gebruiker
 * @apiSuccess {String[]} user.roles Rollen van de gebruiker
 * 
 * @apiHeader {String} Authorization Bearer token voor authenticatie
 */
const getUserById = async (ctx: KoaContext<GetUserByIdResponse, GetUserRequest>) => {
  const user = await userService.getById(ctx.params.id == 'me' ? ctx.state.session.user_id : ctx.params.id);
  ctx.status = 200;
  ctx.body = user;
};
getUserById.validationScheme = {
  params: {
    id: Joi.alternatives().try(Joi.number().integer().positive(), Joi.string().valid('me')),
  },
};

/**
 * @api {put} /api/users/:id Update een gebruiker
 * @apiName UpdateUserById
 * @apiGroup User
 * @apiVersion 1.0.0
 * 
 * @apiParam {Number} id ID van de gebruiker
 * @apiParam {String} voornaam Voornaam van de gebruiker
 * @apiParam {String} naam Achternaam van de gebruiker
 * @apiParam {String} email E-mailadres van de gebruiker
 * @apiParam {String} telefoon Telefoonnummer van de gebruiker
 * @apiParam {String} password Wachtwoord van de gebruiker
 * @apiParam {String} [straat] Straatnaam van de gebruiker
 * @apiParam {String} [stad] Stad van de gebruiker
 * @apiParam {Number} [nr] Huisnummer van de gebruiker
 * @apiParam {Number} [postcode] Postcode van de gebruiker
 * @apiParam {Date} [geboortedatum] Geboortedatum van de gebruiker
 * @apiParam {String} [huisarts] Naam van de huisarts van de gebruiker
 * @apiParam {String[]} [roles] Rollen van de gebruiker
 * 
 * @apiSuccess {Object} user Gegevens van de bijgewerkte gebruiker
 * 
 * @apiHeader {String} Authorization Bearer token voor authenticatie
*/

const updateUserById = async (ctx: KoaContext<UpdateUserResponse, IdParams, UpdateUserRequest>) => {
  const user = await userService.updateById(ctx.params.id, ctx.request.body);
  ctx.status = 200;
  ctx.body = user;
};
updateUserById.validationScheme = {
  params: { id: Joi.number().integer().positive() },
  body: {
    voornaam: Joi.string().min(2).max(100),
    naam: Joi.string().min(2).max(100),
    email: Joi.string().email(),
    telefoon: Joi.string().pattern(/^\+?[0-9\s\-()]{7,20}$/),
    password: Joi.string().min(8),
    straat: Joi.string().allow(''),
    stad: Joi.string().allow(''),
    nr: Joi.number().allow(''),
    postcode: Joi.number().allow(''),
    geboortedatum: Joi.date().allow(''),
    huisarts: Joi.string().allow(''),
    roles: Joi.array(),
  },
};

/**
 * @api {delete} /api/users/:id Verwijder een gebruiker
 * @apiName DeleteUserById
 * @apiGroup User
 * @apiVersion 1.0.0
 * 
 * @apiParam {Number} id ID van de gebruiker
 * 
 * @apiSuccess {Number} status HTTP-statuscode (204)
 * 
 * @apiHeader {String} Authorization Bearer token voor authenticatie
*/
const deleteUserById = async (ctx: KoaContext<void, IdParams>) => {
  await userService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteUserById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @api {get} /api/users/:id/beschikbaarheden Haal beschikbaarheden van een psycholoog op
 * @apiName GetBeschikbaarhedenByPsycholoogId
 * @apiGroup User
 * @apiVersion 1.0.0
 * 
 * @apiParam {Number} id ID van de psycholoog
 * 
 * @apiSuccess {Object[]} items Lijst van beschikbaarheden van de psycholoog
 * @apiSuccess {Date} items.datum Datum van de beschikbaarheid
 * 
 * @apiHeader {String} Authorization Bearer token voor authenticatie
 */
const getBeschikbaarhedenByPsycholoogId = async (ctx: KoaContext<GetAllBeschikbaarhedenResponse, IdParams>) => {
  const beschikbaarheden = await beschikbaarheidsService.getBeschikbaarhedenByPsycholoogId(ctx.params.id);
  ctx.body = {
    items: beschikbaarheden,
  };
};
getBeschikbaarhedenByPsycholoogId.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @api {get} /api/users/:id/services Haal services van een psycholoog op
 * @apiName GetServicesByPsycholoogId
 * @apiGroup User
 * @apiVersion 1.0.0
 * 
 * @apiParam {Number} id ID van de psycholoog
 * 
 * @apiSuccess {Object[]} items Lijst van services van de psycholoog
 * @apiSuccess {String} items.naam Naam van de service
 * @apiSuccess {Number} items.duur Duur van de service
 * @apiSuccess {Number} items.prijs Prijs van de service
 * @apiSuccess {String} items.beschrijving Beschrijving van de service
 * 
 * @apiHeader {String} Authorization Bearer token voor authenticatie
 */

const getServicesByPsycholoogId = async (ctx: KoaContext<GetAllServicesResponse, IdParams>) => {
  const services = await serviceService.getServicesByPsycholoogId(ctx.params.id);
  ctx.body = {
    items: services,
  };
};
getServicesByPsycholoogId.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @api {get} /api/users/:id/afspraken Haal afspraken van een klant op
 * @apiName GetAfsprakenByKlantId
 * @apiGroup User
 * @apiVersion 1.0.0
 * 
 * @apiParam {Number} id ID van de klant
 * 
 * @apiSuccess {Object[]} items Lijst van afspraken van de klant
 * @apiSuccess {Date} items.datum Datum van de afspraak
 * @apiSuccess {String} items.service Naam van de service
 * 
 * @apiHeader {String} Authorization Bearer token voor authenticatie
 */
const getAfsprakenByKlantId = async (ctx: KoaContext<GetAllAfsprakenResponse, IdParams>) => {
  const afspraken = await afsprakenService.getAfsprakenByKlantId(ctx.params.id);
  ctx.body = {
    items: afspraken,
  };
};
getAfsprakenByKlantId.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @api {get} /api/users/:id/afspraken Haal afspraken van een psycholoog op
 * @apiName GetAfsprakenByPsycholoogId
 * @apiGroup User
 * @apiVersion 1.0.0
 * 
 * @apiParam {Number} id ID van de psycholoog
 * 
 * @apiSuccess {Object[]} items Lijst van afspraken van de psycholoog
 * @apiSuccess {Date} items.datum Datum van de afspraak
 * @apiSuccess {String} items.service Naam van de service
 * 
 * @apiHeader {String} Authorization Bearer token voor authenticatie
 */
const getAfsprakenByPsycholoogId = async (ctx: KoaContext<GetAllAfsprakenResponse, IdParams>) => {
  const afspraken = await afsprakenService.getAfsprakenByPsycholoogId(ctx.params.id);
  ctx.body = {
    items: afspraken,
  };
};
getAfsprakenByPsycholoogId.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const requirePsycholoog = makeRequireRole(Role.PSYCHOLOOG);

export default (parent: KoaRouter) => {
  const router = new Router<PsychplannerAppState, PsychplannerAppContext>({ prefix: '/users' });

  router.get('/', requireAuthentication, validate(getAllUsers.validationScheme), getAllUsers);
  router.get('/:id', requireAuthentication, validate(getUserById.validationScheme), getUserById);
  router.get('/:id/beschikbaarheden', requireAuthentication,
    validate(getBeschikbaarhedenByPsycholoogId.validationScheme), getBeschikbaarhedenByPsycholoogId);
  router.get('/:id/services', requireAuthentication,
    validate(getServicesByPsycholoogId.validationScheme), getServicesByPsycholoogId);
  router.get('/:id/afspraken', requireAuthentication,
    validate(getAfsprakenByKlantId.validationScheme), getAfsprakenByKlantId);
  router.get('/:id/afspraken', requireAuthentication, requirePsycholoog,
    validate(getAfsprakenByPsycholoogId.validationScheme), getAfsprakenByPsycholoogId);
  router.post('/', validate(createUser.validationScheme), createUser);
  router.put('/:id', requireAuthentication, validate(updateUserById.validationScheme), updateUserById);
  router.delete('/:id', requireAuthentication, validate(deleteUserById.validationScheme), deleteUserById);

  parent
    .use(router.routes())
    .use(router.allowedMethods());
};
