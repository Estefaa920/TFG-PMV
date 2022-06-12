import dayjs from 'dayjs/esm';
import { ICompra } from 'app/entities/compra/compra.model';
import { IAforo } from 'app/entities/aforo/aforo.model';
import { IPelicula } from 'app/entities/pelicula/pelicula.model';
import { ISala } from 'app/entities/sala/sala.model';

export interface IProyeccion {
  id?: number;
  fecha?: dayjs.Dayjs;
  precio?: number;
  compras?: ICompra[] | null;
  aforos?: IAforo[] | null;
  pelicula?: IPelicula | null;
  sala?: ISala | null;
  numeroDisponibles?: number;
}

export class Proyeccion implements IProyeccion {
  constructor(
    public id?: number,
    public fecha?: dayjs.Dayjs,
    public precio?: number,
    public compras?: ICompra[] | null,
    public aforos?: IAforo[] | null,
    public pelicula?: IPelicula | null,
    public sala?: ISala | null
  ) {}
}

export function getProyeccionIdentifier(proyeccion: IProyeccion): number | undefined {
  return proyeccion.id;
}
