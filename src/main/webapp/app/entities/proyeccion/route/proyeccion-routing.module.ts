import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProyeccionComponent } from '../list/proyeccion.component';
import { ProyeccionDetailComponent } from '../detail/proyeccion-detail.component';
import { ProyeccionUpdateComponent } from '../update/proyeccion-update.component';
import { ProyeccionRoutingResolveService } from './proyeccion-routing-resolve.service';
import { ReservaComponent } from 'app/reserva/reserva.component';
import { CreacionProyeccionesComponent } from '../../../creacion-proyecciones/creacion-proyecciones.component';
import { Authority } from 'app/config/authority.constants';

const proyeccionRoute: Routes = [
  {
    path: '',
    component: ProyeccionComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProyeccionDetailComponent,
    resolve: {
      proyeccion: ProyeccionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProyeccionUpdateComponent,
    resolve: {
      proyeccion: ProyeccionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'reserva/:id/butacas',
    component: ReservaComponent,
    resolve: {
      proyeccion: ProyeccionRoutingResolveService,
    },
    data: {
      authorities: [Authority.ADMIN, Authority.USER, Authority.CLIENTE],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProyeccionUpdateComponent,
    resolve: {
      proyeccion: ProyeccionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },

  {
    path: 'formulario',
    component: CreacionProyeccionesComponent,
    resolve: {
      proyeccion: ProyeccionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(proyeccionRoute)],
  exports: [RouterModule],
})
export class ProyeccionRoutingModule {}
