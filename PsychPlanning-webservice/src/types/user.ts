import type { Prisma } from '@prisma/client';
import type { Entity, ListResponse } from './common';

export interface User extends Entity {
  voornaam: string;
  naam: string;
  email: string;
  telefoon: string;
  password_hash: string;
  roles: Prisma.JsonValue;
  geboortedatum: Date | null;
  huisarts: string | null;
  nr: number | null;
  postcode: number | null;
  stad: string | null;
  straat: string | null;
}

export interface UserCreateInput {
  voornaam: string;
  naam: string;
  email: string;
  password: string;
  telefoon: string;
  geboortedatum: Date | null;
  huisarts: string | null;
  nr: number | null;
  postcode: number | null;
  stad: string | null;
  straat: string | null;
  roles: Prisma.JsonValue;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface GetUserRequest {
  id: number | 'me'
}

export interface PublicUser extends Pick<User, 'id' | 'naam' | 'email' | 'telefoon' | 'voornaam' | 'roles'> { }

export interface UserUpdateInput extends Pick<UserCreateInput, 'naam' | 'email' | 'telefoon' | 'voornaam'> { }

export interface CreateUserRequest {
  voornaam: string;
  naam: string;
  email: string;
  password: string;
  telefoon: string;
  geboortedatum: Date | null;
  huisarts: string | null;
  nr: number | null;
  postcode: number | null;
  stad: string | null;
  straat: string | null;
  roles: Prisma.JsonValue;
}

export interface UpdateUserRequest extends Pick<CreateUserRequest, 'email' | 'naam' | 'telefoon' | 'voornaam'> { }

export interface GetAllUsersResponse extends ListResponse<PublicUser> { }
export interface GetUserByIdResponse extends PublicUser { }
export interface CreateUserResponse extends GetUserByIdResponse { }
export interface UpdateUserResponse extends GetUserByIdResponse { }
