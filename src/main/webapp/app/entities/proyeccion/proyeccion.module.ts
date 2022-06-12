import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProyeccionComponent } from './list/proyeccion.component';
import { ProyeccionDetailComponent } from './detail/proyeccion-detail.component';
import { ProyeccionUpdateComponent } from './update/proyeccion-update.component';
import { ProyeccionDeleteDialogComponent } from './delete/proyeccion-delete-dialog.component';
import { ProyeccionRoutingModule } from './route/proyeccion-routing.module';

@NgModule({
  imports: [SharedModule, ProyeccionRoutingModule],
  declarations: [ProyeccionComponent, ProyeccionDetailComponent, ProyeccionUpdateComponent, ProyeccionDeleteDialogComponent],
  entryComponents: [ProyeccionDeleteDialogComponent],
})
export class ProyeccionModule {}
