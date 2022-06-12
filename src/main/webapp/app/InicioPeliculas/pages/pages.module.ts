import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from '../components/components.module';
import { HomePeliculaComponent } from './homePelicula/homePelicula.component';

import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CastSlideShowComponent } from '../components/cast-slideshow/cast-slideshow.component';
import { ApiPeliculasComponent } from './APIpeliculas/api-peliculas.component';

@NgModule({
  declarations: [HomePeliculaComponent, ApiPeliculasComponent, CastSlideShowComponent],
  imports: [CommonModule, ComponentsModule, NgbModule, ReactiveFormsModule],

  exports: [HomePeliculaComponent, ApiPeliculasComponent, CastSlideShowComponent],
})
export class PagesModule {}
