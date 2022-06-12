import { IProyeccion } from 'app/entities/proyeccion/proyeccion.model';

export interface IPelicula {
  id?: number;
  nombre?: string;
  descripcion?: string;
  duracion?: number;
  enCartelera?: boolean;
  proyeccions?: IProyeccion[] | null;
  url?: string;
  idApi?: number;
}

export class Pelicula implements IPelicula {
  constructor(
    public id?: number,
    public nombre?: string,
    public descripcion?: string,
    public duracion?: number,
    public enCartelera?: boolean,
    public proyeccions?: IProyeccion[] | null,
    public url?: string,
    public idApi?: number
  ) {
    this.enCartelera = this.enCartelera ?? false;
  }
}

export function getPeliculaIdentifier(pelicula: IPelicula): number | undefined {
  return pelicula.id;
}
