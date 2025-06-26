import type { ParameterizedContext } from 'koa';
import type Application from 'koa';
import type Router from '@koa/router';
import type { SessionInfo } from './auth';

export interface PsychplannerAppState {
  session: SessionInfo
}

export interface PsychplannerAppContext<
  Params = unknown,
  RequestBody = unknown,
  Query = unknown,
> {
  request: {
    body: RequestBody;
    query: Query;
  };
  params: Params;
}

export type KoaContext<
  ResponseBody = unknown,
  Params = unknown,
  RequestBody = unknown,
  Query = unknown,
> = ParameterizedContext<
  PsychplannerAppState,
  PsychplannerAppContext<Params, RequestBody, Query>,
  ResponseBody
>;

export interface KoaApplication
  extends Application<PsychplannerAppState, PsychplannerAppContext> { }

export interface KoaRouter extends Router<PsychplannerAppState, PsychplannerAppContext> { }
