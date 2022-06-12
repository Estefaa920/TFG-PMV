import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IButaca } from '../butaca.model';

@Component({
  selector: 'jhi-butaca-detail',
  templateUrl: './butaca-detail.component.html',
})
export class ButacaDetailComponent implements OnInit {
  butaca: IButaca | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ butaca }) => {
      this.butaca = butaca;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
