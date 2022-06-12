import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPelicula, getPeliculaIdentifier } from '../pelicula.model';

export type EntityResponseType = HttpResponse<IPelicula>;
export type EntityArrayResponseType = HttpResponse<IPelicula[]>;

@Injectable({ providedIn: 'root' })
export class PeliculaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/peliculas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(pelicula: IPelicula): Observable<EntityResponseType> {
    return this.http.post<IPelicula>(this.resourceUrl, pelicula, { observe: 'response' });
  }

  update(pelicula: IPelicula): Observable<EntityResponseType> {
    return this.http.put<IPelicula>(`${this.resourceUrl}/${getPeliculaIdentifier(pelicula) as number}`, pelicula, { observe: 'response' });
  }

  partialUpdate(pelicula: IPelicula): Observable<EntityResponseType> {
    return this.http.patch<IPelicula>(`${this.resourceUrl}/${getPeliculaIdentifier(pelicula) as number}`, pelicula, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPelicula>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  cargarEnEstreno(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPelicula[]>(`${this.resourceUrl}/estreno`, { observe: 'response' });
  }

  cargarPelicula(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPelicula[]>(`${this.resourceUrl}/sinPages`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPelicula[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPeliculaToCollectionIfMissing(peliculaCollection: IPelicula[], ...peliculasToCheck: (IPelicula | null | undefined)[]): IPelicula[] {
    const peliculas: IPelicula[] = peliculasToCheck.filter(isPresent);
    if (peliculas.length > 0) {
      const peliculaCollectionIdentifiers = peliculaCollection.map(peliculaItem => getPeliculaIdentifier(peliculaItem)!);
      const peliculasToAdd = peliculas.filter(peliculaItem => {
        const peliculaIdentifier = getPeliculaIdentifier(peliculaItem);
        if (peliculaIdentifier == null || peliculaCollectionIdentifiers.includes(peliculaIdentifier)) {
          return false;
        }
        peliculaCollectionIdentifiers.push(peliculaIdentifier);
        return true;
      });
      return [...peliculasToAdd, ...peliculaCollection];
    }
    return peliculaCollection;
  }

  loadByname(nombre: string): Observable<EntityArrayResponseType> {
    return this.http.get<IPelicula[]>(`${this.resourceUrl}/nombre/${nombre}`, { observe: 'response' });
  }
}
