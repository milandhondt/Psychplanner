import type { Entity, ListResponse } from './common';

export interface Beschikbaarheid extends Entity {
  datum_start: Date;
  datum_eind: Date;
  psycholoog_id: number;
}

export interface BeschikbaarheidCreateInput {
  datum_start: Date;
  datum_eind: Date;
  psycholoog_id: number;
}

export interface BeschikbaarheidUpdateInput extends BeschikbaarheidCreateInput { }

export interface CreateBeschikbaarheidRequest extends BeschikbaarheidCreateInput { }
export interface UpdateBeschikbaarheidRequest extends BeschikbaarheidUpdateInput { }

export interface GetAllBeschikbaarhedenResponse extends ListResponse<Beschikbaarheid> { }
export interface GetBeschikbaarheidByIdResponse extends Beschikbaarheid { }
export interface CreateBeschikbaarheidResponse extends GetBeschikbaarheidByIdResponse { }
export interface UpdateBeschikbaarheidResponse extends GetBeschikbaarheidByIdResponse { }
