import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PosterGridComponent } from './poster-grid/poster-grid.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [PosterGridComponent],
  imports: [CommonModule, NgbModule],

  exports: [PosterGridComponent],
})
export class ComponentsModule {}
