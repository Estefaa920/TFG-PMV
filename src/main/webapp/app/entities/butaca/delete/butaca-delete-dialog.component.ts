import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IButaca } from '../butaca.model';
import { ButacaService } from '../service/butaca.service';

@Component({
  templateUrl: './butaca-delete-dialog.component.html',
})
export class ButacaDeleteDialogComponent {
  butaca?: IButaca;

  constructor(protected butacaService: ButacaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.butacaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
