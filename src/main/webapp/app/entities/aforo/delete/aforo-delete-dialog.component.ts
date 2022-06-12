import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAforo } from '../aforo.model';
import { AforoService } from '../service/aforo.service';

@Component({
  templateUrl: './aforo-delete-dialog.component.html',
})
export class AforoDeleteDialogComponent {
  aforo?: IAforo;

  constructor(protected aforoService: AforoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.aforoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
