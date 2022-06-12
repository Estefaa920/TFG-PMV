import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { ReservaComponent } from 'app/reserva/reserva.component';

import { FormularioProductoComponent } from 'app/formulario/formulario-producto/formulario-producto.component';
import { FormularioComponent } from 'app/formulario/formulario.component';
import { FormularioProyeccionComponent } from 'app/formulario/formulario-proyeccion/formulario-proyeccion.component';
import { ModalComponent } from 'app/formulario/formulario-proyeccion/proyecciones-modal/proyecciones-modal.component';
import { ResumenComponent } from 'app/formulario/resumen-compra-modal/resumen-modal.component';
import { CreacionProyeccionesComponent } from 'app/creacion-proyecciones/creacion-proyecciones.component';
import { InicioPeliculaModule } from 'app/InicioPeliculas/inicioPeliculas.module';
import { InicioComponent } from './inicio/inicio.component';
import { ReservaModalComponent } from '../reserva/reserva-modal/reserva-modal.component';
import { CreacionPeliculasComponent } from 'app/creacion-peliculas/creacion-peliculas.component';
import { VentaEntradasComponent } from 'app/venta-entradas/venta-entradas.component';
import { TodasGeneralComponent } from 'app/todas-general/todas-general.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([HOME_ROUTE]), InicioPeliculaModule],
  declarations: [
    HomeComponent,
    FormularioComponent,
    FormularioProyeccionComponent,
    ModalComponent,
    FormularioProductoComponent,
    ReservaComponent,
    ResumenComponent,
    CreacionProyeccionesComponent,
    CreacionPeliculasComponent,
    InicioComponent,
    ReservaModalComponent,
    VentaEntradasComponent,
    TodasGeneralComponent,
  ],
})
export class HomeModule {}
