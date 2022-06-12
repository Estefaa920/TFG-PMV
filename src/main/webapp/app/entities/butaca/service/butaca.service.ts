import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IButaca, getButacaIdentifier } from '../butaca.model';

export type EntityResponseType = HttpResponse<IButaca>;
export type EntityArrayResponseType = HttpResponse<IButaca[]>;

@Injectable({ providedIn: 'root' })
export class ButacaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/butacas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(butaca: IButaca): Observable<EntityResponseType> {
    return this.http.post<IButaca>(this.resourceUrl, butaca, { observe: 'response' });
  }

  update(butaca: IButaca): Observable<EntityResponseType> {
    return this.http.put<IButaca>(`${this.resourceUrl}/${getButacaIdentifier(butaca) as number}`, butaca, { observe: 'response' });
  }

  partialUpdate(butaca: IButaca): Observable<EntityResponseType> {
    return this.http.patch<IButaca>(`${this.resourceUrl}/${getButacaIdentifier(butaca) as number}`, butaca, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IButaca>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IButaca[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

 

  addButacaToCollectionIfMissing(butacaCollection: IButaca[], ...butacasToCheck: (IButaca | null | undefined)[]): IButaca[] {
    const butacas: IButaca[] = butacasToCheck.filter(isPresent);
    if (butacas.length > 0) {
      const butacaCollectionIdentifiers = butacaCollection.map(butacaItem => getButacaIdentifier(butacaItem)!);
      const butacasToAdd = butacas.filter(butacaItem => {
        const butacaIdentifier = getButacaIdentifier(butacaItem);
        if (butacaIdentifier == null || butacaCollectionIdentifiers.includes(butacaIdentifier)) {
          return false;
        }
        butacaCollectionIdentifiers.push(butacaIdentifier);
        return true;
      });
      return [...butacasToAdd, ...butacaCollection];
    }
    return butacaCollection;
  }
}
