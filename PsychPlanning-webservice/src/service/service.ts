import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import type { Service, ServiceCreateInput, ServiceUpdateInput } from '../types/service';
import handleDBError from './_handleDBError';

const SERVICE_SELECT = {
  id: true,
  naam: true,
  duur: true,
  prijs: true,
  beschrijving: true,
};

export const getAll = async (): Promise<Service[]> => {
  return await prisma.service.findMany({
    select: SERVICE_SELECT,
  });
};

export const getById = async (id: number): Promise<Service> => {
  const service = await prisma.service.findUnique({
    where: {
      id,
    },
    select: SERVICE_SELECT,
  });

  if (!service) {
    throw ServiceError.notFound(`Er bestaat geen service met id ${id}`);
  }

  return service;
};

export const create = async (service: ServiceCreateInput): Promise<Service> => {
  try {
    return await prisma.service.create({
      data: service,
      select: SERVICE_SELECT,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const updateById = async (id: number, changes: ServiceUpdateInput): Promise<Service> => {
  try {
    return prisma.service.update({
      where: {
        id,
      },
      data: changes,
    });
  } catch (error) {
    throw handleDBError(error);
  }

};

export const deleteById = async (id: number): Promise<void> => {
  try {
    await prisma.service.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const getServicesByPsycholoogId = async (psycholoog_id: number): Promise<Service[]> => {
  return await prisma.service.findMany({
    where: {
      psychologen: {
        some: {
          id: psycholoog_id,
        },
      },
    },
    select: SERVICE_SELECT,
  });
};
