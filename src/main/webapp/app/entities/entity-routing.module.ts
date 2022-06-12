import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CreacionPeliculasComponent } from 'app/creacion-peliculas/creacion-peliculas.component';
import { TodasGeneralComponent } from 'app/todas-general/todas-general.component';
import { VentaEntradasComponent } from 'app/venta-entradas/venta-entradas.component';
import { FormularioComponent } from '../formulario/formulario.component';
import { PeliculaUpdateComponent } from './pelicula/update/pelicula-update.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'pelicula',
        data: { pageTitle: 'cineApp.pelicula.home.title' },
        loadChildren: () => import('./pelicula/pelicula.module').then(m => m.PeliculaModule),
      },
      {
        path: 'proyeccion',
        data: { pageTitle: 'cineApp.proyeccion.home.title' },
        loadChildren: () => import('./proyeccion/proyeccion.module').then(m => m.ProyeccionModule),
      },
      {
        path: 'sala',
        data: { pageTitle: 'cineApp.sala.home.title' },
        loadChildren: () => import('./sala/sala.module').then(m => m.SalaModule),
      },
      {
        path: 'butaca',
        data: { pageTitle: 'cineApp.butaca.home.title' },
        loadChildren: () => import('./butaca/butaca.module').then(m => m.ButacaModule),
      },
      {
        path: 'compra',
        data: { pageTitle: 'cineApp.compra.home.title' },
        loadChildren: () => import('./compra/compra.module').then(m => m.CompraModule),
      },
      {
        path: 'pedido',
        data: { pageTitle: 'cineApp.pedido.home.title' },
        loadChildren: () => import('./pedido/pedido.module').then(m => m.PedidoModule),
      },
      {
        path: 'producto',
        data: { pageTitle: 'cineApp.producto.home.title' },
        loadChildren: () => import('./producto/producto.module').then(m => m.ProductoModule),
      },
      {
        path: 'aforo',
        data: { pageTitle: 'cineApp.aforo.home.title' },
        loadChildren: () => import('./aforo/aforo.module').then(m => m.AforoModule),
      },

      {
        path: 'newPelicula',
        component: PeliculaUpdateComponent,
        canActivate: [UserRouteAccessService],
      },

      {
        path: 'formulario',
        component: FormularioComponent,
        data: {
          authorities: [Authority.ADMIN, Authority.USER],
        },
        canActivate: [UserRouteAccessService],
      },

      {
        path: 'formulario/2',
        component: CreacionPeliculasComponent,
        data: {
          authorities: [Authority.ADMIN, Authority.USER],
        },
        canActivate: [UserRouteAccessService],
      },

      {
        path: 'entradas',
        component: VentaEntradasComponent,
        data: {
          authorities: [Authority.ADMIN, Authority.USER],
        },
      },
      {
        path: 'todo-general',
        component: TodasGeneralComponent,
        data: {
          authorities: [Authority.ADMIN, Authority.USER],
        },
      },

      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
