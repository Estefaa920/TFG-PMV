import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { InicioPeliculaComponent } from './InicioPelicula.component';
import { ApiPeliculasComponent } from './pages/APIpeliculas/api-peliculas.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'home',
        component: InicioPeliculaComponent,
      },
      {
        path: 'pelicula/:id',
        component: ApiPeliculasComponent,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class InicioPeliculaRouting {}
