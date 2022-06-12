import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProyeccion } from '../proyeccion.model';

@Component({
  selector: 'jhi-proyeccion-detail',
  templateUrl: './proyeccion-detail.component.html',
})
export class ProyeccionDetailComponent implements OnInit {
  proyeccion: IProyeccion | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ proyeccion }) => {
      this.proyeccion = proyeccion;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
