import { prisma } from '../data';
import type { Afspraak, AfspraakCreateInput, AfspraakUpdateInput } from '../types/afspraak';
import ServiceError from '../core/serviceError';
import handleDBError from './_handleDBError';

const AFSPRAAK_SELECT = {
  id: true,
  datum: true,
  formulier_nodig: true,
  opmerking: true,
  klant_id: true,
  psycholoog_id: true,
  service_id: true,
};

export const getAll = async (): Promise<Afspraak[]> => {
  return await prisma.afspraak.findMany({
    select: AFSPRAAK_SELECT,
  });
};

export const getById = async (id: number): Promise<Afspraak> => {
  const afspraak = await prisma.afspraak.findUnique({
    where: {
      id,
    },
    select: AFSPRAAK_SELECT,
  });

  if (!afspraak) {
    throw ServiceError.notFound(`Er bestaat geen afspraak met id ${id}`);
  }

  return afspraak;
};

export const create = async (afspraak: AfspraakCreateInput): Promise<Afspraak> => {
  try {
    return await prisma.afspraak.create({
      data: {
        datum: afspraak.datum,
        formulier_nodig: afspraak.formulier_nodig,
        opmerking: afspraak?.opmerking,
        klant_id: afspraak.klant_id,
        psycholoog_id: afspraak.psycholoog_id,
        service_id: afspraak.service_id,
      },
      select: AFSPRAAK_SELECT,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const updateById = async (id: number, changes: AfspraakUpdateInput): Promise<Afspraak> => {
  try {
    return await prisma.afspraak.update({
      where: {
        id,
      },
      data: {
        datum: changes.datum,
        formulier_nodig: changes.formulier_nodig,
        opmerking: changes?.opmerking,
        klant_id: changes.klant_id,
        psycholoog_id: changes.psycholoog_id,
        service_id: changes.service_id,
      },
      select: AFSPRAAK_SELECT,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number): Promise<void> => {
  try {
    await prisma.afspraak.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const getAfsprakenByKlantId = async (klant_id: number): Promise<Afspraak[]> => {
  return await prisma.afspraak.findMany({
    where:
      { klant_id },
    select: AFSPRAAK_SELECT,
  });
};

export const getAfsprakenByPsycholoogId = async (psycholoog_id: number): Promise<Afspraak[]> => {
  return await prisma.afspraak.findMany({
    where:
      { psycholoog_id },
    select: AFSPRAAK_SELECT,
  });
};
