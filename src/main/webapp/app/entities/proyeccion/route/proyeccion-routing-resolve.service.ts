import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProyeccion, Proyeccion } from '../proyeccion.model';
import { ProyeccionService } from '../service/proyeccion.service';

@Injectable({ providedIn: 'root' })
export class ProyeccionRoutingResolveService implements Resolve<IProyeccion> {
  constructor(protected service: ProyeccionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProyeccion> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((proyeccion: HttpResponse<Proyeccion>) => {
          if (proyeccion.body) {
            return of(proyeccion.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Proyeccion());
  }
}
