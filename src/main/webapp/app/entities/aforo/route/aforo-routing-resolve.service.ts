import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAforo, Aforo } from '../aforo.model';
import { AforoService } from '../service/aforo.service';

@Injectable({ providedIn: 'root' })
export class AforoRoutingResolveService implements Resolve<IAforo> {
  constructor(protected service: AforoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAforo> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((aforo: HttpResponse<Aforo>) => {
          if (aforo.body) {
            return of(aforo.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Aforo());
  }
}
