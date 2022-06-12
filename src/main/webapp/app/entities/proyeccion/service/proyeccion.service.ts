import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs, { Dayjs } from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProyeccion, getProyeccionIdentifier } from '../proyeccion.model';

export type EntityResponseType = HttpResponse<IProyeccion>;
export type EntityArrayResponseType = HttpResponse<IProyeccion[]>;

@Injectable({ providedIn: 'root' })
export class ProyeccionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/proyeccions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(proyeccion: IProyeccion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(proyeccion);
    return this.http
      .post<IProyeccion>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(proyeccion: IProyeccion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(proyeccion);
    return this.http
      .put<IProyeccion>(`${this.resourceUrl}/${getProyeccionIdentifier(proyeccion) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(proyeccion: IProyeccion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(proyeccion);
    return this.http
      .patch<IProyeccion>(`${this.resourceUrl}/${getProyeccionIdentifier(proyeccion) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IProyeccion>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProyeccion[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  findByPeliculaId(id_pelicula: number): Observable<EntityArrayResponseType> {
    return this.http.get<IProyeccion[]>(`${this.resourceUrl}/id_pelicula/${id_pelicula}`, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findproyecionFecha(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);

    return this.http.get<IProyeccion[]>(`${this.resourceUrl}/all/fecha`, { params: options, observe: 'response' });
  }

  addProyeccionToCollectionIfMissing(
    proyeccionCollection: IProyeccion[],
    ...proyeccionsToCheck: (IProyeccion | null | undefined)[]
  ): IProyeccion[] {
    const proyeccions: IProyeccion[] = proyeccionsToCheck.filter(isPresent);
    if (proyeccions.length > 0) {
      const proyeccionCollectionIdentifiers = proyeccionCollection.map(proyeccionItem => getProyeccionIdentifier(proyeccionItem)!);
      const proyeccionsToAdd = proyeccions.filter(proyeccionItem => {
        const proyeccionIdentifier = getProyeccionIdentifier(proyeccionItem);
        if (proyeccionIdentifier == null || proyeccionCollectionIdentifiers.includes(proyeccionIdentifier)) {
          return false;
        }
        proyeccionCollectionIdentifiers.push(proyeccionIdentifier);
        return true;
      });
      return [...proyeccionsToAdd, ...proyeccionCollection];
    }
    return proyeccionCollection;
  }

  protected convertDateFromClient(proyeccion: IProyeccion): IProyeccion {
    return Object.assign({}, proyeccion, {
      fecha: proyeccion.fecha?.isValid() ? proyeccion.fecha.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fecha = res.body.fecha ? dayjs(res.body.fecha) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((proyeccion: IProyeccion) => {
        proyeccion.fecha = proyeccion.fecha ? dayjs(proyeccion.fecha) : undefined;
      });
    }
    return res;
  }
}
