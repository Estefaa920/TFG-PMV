import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAforo, getAforoIdentifier } from '../aforo.model';

export type EntityResponseType = HttpResponse<IAforo>;
export type EntityArrayResponseType = HttpResponse<IAforo[]>;

@Injectable({ providedIn: 'root' })
export class AforoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/aforos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(aforo: IAforo): Observable<EntityResponseType> {
    return this.http.post<IAforo>(this.resourceUrl, aforo, { observe: 'response' });
  }

  update(aforo: IAforo): Observable<EntityResponseType> {
    return this.http.put<IAforo>(`${this.resourceUrl}/${getAforoIdentifier(aforo) as number}`, aforo, { observe: 'response' });
  }

  partialUpdate(aforo: IAforo): Observable<EntityResponseType> {
    return this.http.patch<IAforo>(`${this.resourceUrl}/${getAforoIdentifier(aforo) as number}`, aforo, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAforo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAforo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  query2(proyeccion?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(proyeccion);
    return this.http.get<IAforo[]>(`${this.resourceUrl}/butacas`, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAforoToCollectionIfMissing(aforoCollection: IAforo[], ...aforosToCheck: (IAforo | null | undefined)[]): IAforo[] {
    const aforos: IAforo[] = aforosToCheck.filter(isPresent);
    if (aforos.length > 0) {
      const aforoCollectionIdentifiers = aforoCollection.map(aforoItem => getAforoIdentifier(aforoItem)!);
      const aforosToAdd = aforos.filter(aforoItem => {
        const aforoIdentifier = getAforoIdentifier(aforoItem);
        if (aforoIdentifier == null || aforoCollectionIdentifiers.includes(aforoIdentifier)) {
          return false;
        }
        aforoCollectionIdentifiers.push(aforoIdentifier);
        return true;
      });
      return [...aforosToAdd, ...aforoCollection];
    }
    return aforoCollection;
  }
}
