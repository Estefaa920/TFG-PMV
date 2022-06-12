import { ICompra } from 'app/entities/compra/compra.model';
import { IProducto } from 'app/entities/producto/producto.model';

export interface IPedido {
  id?: number;
  cantidad?: number;
  compra?: ICompra | null;
  producto?: IProducto | null;
}

export class Pedido implements IPedido {
  constructor(public id?: number, public cantidad?: number, public compra?: ICompra | null, public producto?: IProducto | null) {}
}

export function getPedidoIdentifier(pedido: IPedido): number | undefined {
  return pedido.id;
}
