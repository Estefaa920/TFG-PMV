import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AforoComponent } from '../list/aforo.component';
import { AforoDetailComponent } from '../detail/aforo-detail.component';
import { AforoUpdateComponent } from '../update/aforo-update.component';
import { AforoRoutingResolveService } from './aforo-routing-resolve.service';

const aforoRoute: Routes = [
  {
    path: '',
    component: AforoComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AforoDetailComponent,
    resolve: {
      aforo: AforoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AforoUpdateComponent,
    resolve: {
      aforo: AforoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AforoUpdateComponent,
    resolve: {
      aforo: AforoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(aforoRoute)],
  exports: [RouterModule],
})
export class AforoRoutingModule {}
