import type { SchemaLike, Schema } from 'joi';
import Joi from 'joi';
import type { KoaContext } from '../types/koa';
import type { Next } from 'koa';

const JOI_OPTIONS: Joi.ValidationOptions = {
  abortEarly: true,
  allowUnknown: false,
  convert: true,
  presence: 'required',
};

type RequestValidationSchemeInput = Partial<Record<'params' | 'body' | 'query', SchemaLike>>;
type RequestValidationScheme = Record<'params' | 'body' | 'query', Schema>;
export default function validate(scheme: RequestValidationSchemeInput | null) {

  const parsedScheme: RequestValidationScheme = {
    params: Joi.object(scheme?.params || {}),
    body: Joi.object(scheme?.body || {}),
    query: Joi.object(scheme?.query || {}),
  };

  return async (ctx: KoaContext, next: Next) => {
    const errors = new Map();

    const { error: paramsError, value: paramsValue } =
      parsedScheme.params.validate(ctx.params, JOI_OPTIONS);

    if (paramsError) {
      errors.set('params', cleanUpJoiError(paramsError));
    } else {
      ctx.params = paramsValue;
    }

    const { error: bodyError, value: bodyValue } =
      parsedScheme.body.validate(ctx.request.body, JOI_OPTIONS);

    if (bodyError) {
      errors.set('body', cleanUpJoiError(bodyError));
    } else {
      ctx.request.body = bodyValue;
    }

    const { error: queryError, value: queryValue } =
      parsedScheme.query.validate(ctx.query, JOI_OPTIONS);

    if (queryError) {
      errors.set('query', cleanUpJoiError(queryError));
    } else {
      ctx.query = queryValue;
    }

    if (errors.size > 0) {
      ctx.throw(400, 'Validation failed, check details for more information', {
        code: 'VALIDATION_FAILED',
        details: Object.fromEntries(errors),
      });
    }

    return next();
  };
}

function cleanUpJoiError(error: Joi.ValidationError) {
  const errorDetails = error.details.reduce(
    (resultObj, { message, path, type }) => {
      const joinedPath = path.join('.') || 'value';
      if (!resultObj.has(joinedPath)) {
        resultObj.set(joinedPath, []);
      }

      resultObj.get(joinedPath).push({
        type,
        message,
      });

      return resultObj;
    },
    new Map(),
  );

  return Object.fromEntries(errorDetails);
};
