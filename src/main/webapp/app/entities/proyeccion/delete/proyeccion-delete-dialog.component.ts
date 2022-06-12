import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProyeccion } from '../proyeccion.model';
import { ProyeccionService } from '../service/proyeccion.service';

@Component({
  templateUrl: './proyeccion-delete-dialog.component.html',
})
export class ProyeccionDeleteDialogComponent {
  proyeccion?: IProyeccion;

  constructor(protected proyeccionService: ProyeccionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.proyeccionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
