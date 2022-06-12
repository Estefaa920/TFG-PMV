import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPedido, getPedidoIdentifier } from '../pedido.model';

export type EntityResponseType = HttpResponse<IPedido>;
export type EntityArrayResponseType = HttpResponse<IPedido[]>;

@Injectable({ providedIn: 'root' })
export class PedidoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pedidos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(pedido: IPedido): Observable<EntityResponseType> {
    return this.http.post<IPedido>(this.resourceUrl, pedido, { observe: 'response' });
  }

  update(pedido: IPedido): Observable<EntityResponseType> {
    return this.http.put<IPedido>(`${this.resourceUrl}/${getPedidoIdentifier(pedido) as number}`, pedido, { observe: 'response' });
  }

  partialUpdate(pedido: IPedido): Observable<EntityResponseType> {
    return this.http.patch<IPedido>(`${this.resourceUrl}/${getPedidoIdentifier(pedido) as number}`, pedido, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPedido>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPedido[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPedidoToCollectionIfMissing(pedidoCollection: IPedido[], ...pedidosToCheck: (IPedido | null | undefined)[]): IPedido[] {
    const pedidos: IPedido[] = pedidosToCheck.filter(isPresent);
    if (pedidos.length > 0) {
      const pedidoCollectionIdentifiers = pedidoCollection.map(pedidoItem => getPedidoIdentifier(pedidoItem)!);
      const pedidosToAdd = pedidos.filter(pedidoItem => {
        const pedidoIdentifier = getPedidoIdentifier(pedidoItem);
        if (pedidoIdentifier == null || pedidoCollectionIdentifiers.includes(pedidoIdentifier)) {
          return false;
        }
        pedidoCollectionIdentifiers.push(pedidoIdentifier);
        return true;
      });
      return [...pedidosToAdd, ...pedidoCollection];
    }
    return pedidoCollection;
  }
}
