import { IPedido } from 'app/entities/pedido/pedido.model';

export interface IProducto {
  id?: number;
  nombre?: string;
  precio?: number;
  cantidad?: number;
  pedidos?: IPedido[] | null;
}

export class Producto implements IProducto {
  constructor(
    public id?: number,
    public nombre?: string,
    public precio?: number,
    public cantidad?: number,
    public pedidos?: IPedido[] | null
  ) {}
}

export function getProductoIdentifier(producto: IProducto): number | undefined {
  return producto.id;
}
