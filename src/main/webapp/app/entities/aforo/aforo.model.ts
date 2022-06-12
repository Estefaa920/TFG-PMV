import { IProyeccion } from 'app/entities/proyeccion/proyeccion.model';
import { ICompra } from 'app/entities/compra/compra.model';
import { IButaca } from 'app/entities/butaca/butaca.model';

export interface IAforo {
  id?: number;
  reservada?: boolean;
  proyeccion?: IProyeccion | null;
  compra?: ICompra | null;
  butaca?: IButaca | null;
}

export class Aforo implements IAforo {
  constructor(
    public id?: number,
    public reservada?: boolean,
    public proyeccion?: IProyeccion | null,
    public compra?: ICompra | null,
    public butaca?: IButaca | null
  ) {
    this.reservada = this.reservada ?? false;
  }
}

export function getAforoIdentifier(aforo: IAforo): number | undefined {
  return aforo.id;
}
