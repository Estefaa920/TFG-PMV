import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AforoComponent } from './list/aforo.component';
import { AforoDetailComponent } from './detail/aforo-detail.component';
import { AforoUpdateComponent } from './update/aforo-update.component';
import { AforoDeleteDialogComponent } from './delete/aforo-delete-dialog.component';
import { AforoRoutingModule } from './route/aforo-routing.module';

@NgModule({
  imports: [SharedModule, AforoRoutingModule],
  declarations: [AforoComponent, AforoDetailComponent, AforoUpdateComponent, AforoDeleteDialogComponent],
  entryComponents: [AforoDeleteDialogComponent],
})
export class AforoModule {}
