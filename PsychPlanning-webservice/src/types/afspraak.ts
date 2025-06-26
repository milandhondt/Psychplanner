import type { Entity, ListResponse } from './common';
export interface Afspraak extends Entity {
  datum: Date;
  formulier_nodig: boolean;
  opmerking: string | null,
  klant_id: number,
  psycholoog_id: number,
  service_id: number | null,
}

export interface AfspraakCreateInput {
  datum: Date;
  formulier_nodig: boolean;
  opmerking: string | null,
  klant_id: number,
  psycholoog_id: number,
  service_id: number | null,
}

export interface AfspraakUpdateInput extends AfspraakCreateInput { }

export interface CreateAfspraakRequest extends AfspraakCreateInput { }
export interface UpdateAfspraakRequest extends AfspraakUpdateInput { }

export interface GetAllAfsprakenResponse extends ListResponse<Afspraak> { }
export interface GetAfspraakByIdResponse extends Afspraak { }
export interface CreateAfspraakResponse extends GetAfspraakByIdResponse { }
export interface UpdateAfspraakResponse extends GetAfspraakByIdResponse { }
