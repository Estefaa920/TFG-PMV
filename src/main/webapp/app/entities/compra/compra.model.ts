import { IPedido } from 'app/entities/pedido/pedido.model';
import { IAforo } from 'app/entities/aforo/aforo.model';
import { IProyeccion } from 'app/entities/proyeccion/proyeccion.model';

export interface ICompra {
  id?: number;
  nombre?: string;
  dni?: string;
  precioTotal?: number;
  pedidos?: IPedido[] | null;
  aforos?: IAforo[] | null;
  proyeccion?: IProyeccion | null;
}

export class Compra implements ICompra {
  constructor(
    public id?: number,
    public nombre?: string,
    public dni?: string,
    public precioTotal?: number,
    public pedidos?: IPedido[] | null,
    public aforos?: IAforo[] | null,
    public proyeccion?: IProyeccion | null
  ) {}
}

export function getCompraIdentifier(compra: ICompra): number | undefined {
  return compra.id;
}
