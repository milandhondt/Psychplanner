import type { Entity, ListResponse } from './common';

export interface Service extends Entity {
  naam: string;
  duur: number;
  prijs: number;
  beschrijving: string;
}

export interface ServiceCreateInput {
  naam: string;
  duur: number;
  prijs: number;
  beschrijving: string;
}

export interface ServiceUpdateInput extends ServiceCreateInput { }

export interface CreateServiceRequest extends ServiceCreateInput { }
export interface UpdateServiceRequest extends ServiceUpdateInput { }

export interface GetAllServicesResponse extends ListResponse<Service> { }
export interface GetServiceByIdResponse extends Service { }
export interface CreateServiceResponse extends GetServiceByIdResponse { }
export interface UpdateServiceResponse extends GetServiceByIdResponse { }
