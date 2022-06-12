import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ButacaComponent } from './list/butaca.component';
import { ButacaDetailComponent } from './detail/butaca-detail.component';
import { ButacaUpdateComponent } from './update/butaca-update.component';
import { ButacaDeleteDialogComponent } from './delete/butaca-delete-dialog.component';
import { ButacaRoutingModule } from './route/butaca-routing.module';

@NgModule({
  imports: [SharedModule, ButacaRoutingModule],
  declarations: [ButacaComponent, ButacaDetailComponent, ButacaUpdateComponent, ButacaDeleteDialogComponent],
  entryComponents: [ButacaDeleteDialogComponent],
})
export class ButacaModule {}
