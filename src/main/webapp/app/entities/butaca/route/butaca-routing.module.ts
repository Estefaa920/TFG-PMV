import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ButacaComponent } from '../list/butaca.component';
import { ButacaDetailComponent } from '../detail/butaca-detail.component';
import { ButacaUpdateComponent } from '../update/butaca-update.component';
import { ButacaRoutingResolveService } from './butaca-routing-resolve.service';

const butacaRoute: Routes = [
  {
    path: '',
    component: ButacaComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ButacaDetailComponent,
    resolve: {
      butaca: ButacaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ButacaUpdateComponent,
    resolve: {
      butaca: ButacaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ButacaUpdateComponent,
    resolve: {
      butaca: ButacaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(butacaRoute)],
  exports: [RouterModule],
})
export class ButacaRoutingModule {}
