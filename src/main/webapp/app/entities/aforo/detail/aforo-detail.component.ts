import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAforo } from '../aforo.model';

@Component({
  selector: 'jhi-aforo-detail',
  templateUrl: './aforo-detail.component.html',
})
export class AforoDetailComponent implements OnInit {
  aforo: IAforo | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ aforo }) => {
      this.aforo = aforo;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
