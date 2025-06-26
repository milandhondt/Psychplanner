import { hashPassword, verifyPassword } from '../core/password';
import Role from '../core/roles';
import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import type { PublicUser, User, UserCreateInput, UserUpdateInput } from '../types/user';
import handleDBError from './_handleDBError';
import type { SessionInfo } from '../types/auth';
import { getLogger } from '../core/logging';
import { verifyJWT, generateJWT } from '../core/jwt';
import jwt from 'jsonwebtoken';

export const checkAndParseSession = async (
  authHeader?: string,
): Promise<SessionInfo> => {
  if (!authHeader) {
    throw ServiceError.unauthorized('You need to be signed in');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw ServiceError.unauthorized('Invalid authentication token');
  }

  const authToken = authHeader.substring(7);

  try {
    const { roles, sub } = await verifyJWT(authToken);

    return {
      user_id: Number(sub),
      roles,
    };
  } catch (error: any) {
    getLogger().error(error.message, { error });

    if (error instanceof jwt.TokenExpiredError) {
      throw ServiceError.unauthorized('The token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw ServiceError.unauthorized(
        `Invalid authentication token: ${error.message}`,
      );
    } else {
      throw ServiceError.unauthorized(error.message);
    }
  }
};

export const checkRole = (role: string, roles: string[]): void => {
  const hasPermission = roles.includes(role);

  if (!hasPermission) {
    throw ServiceError.forbidden(
      'You are not allowed to view this part of the application',
    );
  }
};

const makeExposedUser = ({ id, naam, email, telefoon, voornaam, roles }: User): PublicUser => {
  return { id, naam, email, telefoon, voornaam, roles };
};

export const getAll = async (): Promise<PublicUser[]> => {
  const users = await prisma.user.findMany();
  return users.map(makeExposedUser);
};

export const getById = async (id: number): Promise<PublicUser> => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw ServiceError.notFound('No user with this id exists');
  }

  return makeExposedUser(user);
};

export const register = async ({ voornaam, naam, email, password, telefoon,
  geboortedatum, straat, nr, postcode, stad, roles, huisarts }: UserCreateInput): Promise<string> => {
  try {
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        voornaam, naam, email, telefoon,
        password_hash: passwordHash,
        roles: roles || [Role.KLANT],
        geboortedatum: geboortedatum || null,
        straat: straat || null,
        nr: nr || null,
        postcode: postcode || null,
        stad: stad || null,
        huisarts: huisarts || null,
      },
    });
    return await generateJWT(user);
  } catch (error) {
    throw handleDBError(error);
  }
};

export const updateById = async (id: number, { naam, email,
  telefoon, voornaam }: UserUpdateInput): Promise<PublicUser> => {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { naam, email, telefoon, voornaam },
    });
    return makeExposedUser(user);
  } catch (error) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number): Promise<void> => {
  try {
    await prisma.user.delete({ where: { id } });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const login = async (email: string, password: string): Promise<string> => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw ServiceError.unauthorized('The given email and password do not match');
  }

  const passwordValid = await verifyPassword(password, user.password_hash);

  if (!passwordValid) {
    throw ServiceError.unauthorized('The given email and password do not match');
  }

  return await generateJWT(user);
};
