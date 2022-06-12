import { IProyeccion } from 'app/entities/proyeccion/proyeccion.model';
import { IButaca } from 'app/entities/butaca/butaca.model';

export interface ISala {
  id?: number;
  nombre?: string;
  proyeccions?: IProyeccion[] | null;
  butacas?: IButaca[] | null;
}

export class Sala implements ISala {
  constructor(public id?: number, public nombre?: string, public proyeccions?: IProyeccion[] | null, public butacas?: IButaca[] | null) {}
}

export function getSalaIdentifier(sala: ISala): number | undefined {
  return sala.id;
}
