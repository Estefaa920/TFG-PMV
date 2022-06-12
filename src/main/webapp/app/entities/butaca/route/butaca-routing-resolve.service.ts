import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IButaca, Butaca } from '../butaca.model';
import { ButacaService } from '../service/butaca.service';

@Injectable({ providedIn: 'root' })
export class ButacaRoutingResolveService implements Resolve<IButaca> {
  constructor(protected service: ButacaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IButaca> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((butaca: HttpResponse<Butaca>) => {
          if (butaca.body) {
            return of(butaca.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Butaca());
  }
}
