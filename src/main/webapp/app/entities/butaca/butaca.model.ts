import { IAforo } from 'app/entities/aforo/aforo.model';
import { ISala } from 'app/entities/sala/sala.model';

export interface IButaca {
  id?: number;
  posicion?: string;
  premium?: boolean;
  aforos?: IAforo[] | null;
  sala?: ISala | null;
  posicionfront?:number| null;
  seleccionadoFront?: boolean;
  reservadoFront?:boolean;
}

export class Butaca implements IButaca {
  constructor(
    public id?: number,
    public posicion?: string,
    public premium?: boolean,
    public aforos?: IAforo[] | null,
    public sala?: ISala | null
  ) {
    this.premium = this.premium ?? false;
  }
}

export function getButacaIdentifier(butaca: IButaca): number | undefined {
  return butaca.id;
}
