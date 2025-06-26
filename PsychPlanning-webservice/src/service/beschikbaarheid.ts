import { prisma } from '../data';
import type { Beschikbaarheid, BeschikbaarheidCreateInput, BeschikbaarheidUpdateInput } from '../types/beschikbaarheid';
import handleDBError from './_handleDBError';
import ServiceError from '../core/serviceError';

const BESCHIKBAARHEID_SELECT = {
  id: true,
  datum_start: true,
  datum_eind: true,
  psycholoog_id: true,
};

export const getAll = async (): Promise<Beschikbaarheid[]> => {
  return await prisma.beschikbaarheid.findMany({
    select: BESCHIKBAARHEID_SELECT,
  });
};

export const getById = async (id: number): Promise<Beschikbaarheid> => {
  const beschikbaarheid = await prisma.beschikbaarheid.findUnique({
    where: {
      id,
    },
    select: BESCHIKBAARHEID_SELECT,
  });

  if (!beschikbaarheid) {
    throw ServiceError.notFound(`Er bestaat geen beschikbaarheid met id ${id}`);
  }

  return beschikbaarheid;
};

export const create = async (beschikbaarheid: BeschikbaarheidCreateInput): Promise<Beschikbaarheid> => {
  try {
    return await prisma.beschikbaarheid.create({
      data: {
        datum_start: beschikbaarheid.datum_start,
        datum_eind: beschikbaarheid.datum_eind,
        psycholoog_id: beschikbaarheid.psycholoog_id,
      },
      select: BESCHIKBAARHEID_SELECT,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const updateById = async (id: number, changes: BeschikbaarheidUpdateInput): Promise<Beschikbaarheid> => {
  try {
    return await prisma.beschikbaarheid.update({
      where: {
        id,
      },
      data: {
        datum_start: changes.datum_start,
        datum_eind: changes.datum_eind,
        psycholoog_id: changes.psycholoog_id,
      },
      select: BESCHIKBAARHEID_SELECT,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number): Promise<void> => {
  try {
    await prisma.beschikbaarheid.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const getBeschikbaarhedenByPsycholoogId = async (psycholoog_id: number): Promise<Beschikbaarheid[]> => {
  return await prisma.beschikbaarheid.findMany({
    where: {
      psycholoog_id,
    },
    select: BESCHIKBAARHEID_SELECT,
  });
};
