import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { ComponentsModule } from './components/components.module';
import { PagesModule } from './pages/pages.module';

import { InicioPeliculaRouting } from './inicioPeliculas-routing.module';
import { InicioPeliculaComponent } from './InicioPelicula.component';

import { HomePeliculaComponent } from './pages/homePelicula/homePelicula.component';

@NgModule({
  declarations: [InicioPeliculaComponent],
  imports: [BrowserModule, HttpClientModule, ComponentsModule, PagesModule, InicioPeliculaRouting],

  exports: [HomePeliculaComponent, ComponentsModule, InicioPeliculaComponent],

  providers: [],
})
export class InicioPeliculaModule {}
