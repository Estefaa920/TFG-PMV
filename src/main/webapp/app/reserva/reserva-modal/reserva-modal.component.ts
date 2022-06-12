import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Aforo, IAforo } from 'app/entities/aforo/aforo.model';
import { AforoService } from 'app/entities/aforo/service/aforo.service';
import { IProyeccion } from 'app/entities/proyeccion/proyeccion.model';

import { GeneralService } from 'app/formulario/service/formulario-general.service';

@Component({
  selector: 'jhi-reserva-modal',
  templateUrl: './reserva-modal.component.html',
  styleUrls: ['./reserva-modal.component.scss'],
})
export class ReservaModalComponent implements OnInit {
  proyeccion?: IProyeccion;
  id_proyeccion?: number;
  abiertoModal = true;
  aforoSeleccionado?: IAforo[];

  constructor(
    public activeModal: NgbActiveModal,
    protected aforoService: AforoService,
    protected router: ActivatedRoute,
    protected navegar: Router,
    protected servicioGeneral: GeneralService
  ) {}

  ngOnInit(): void {
    this.id_proyeccion = this.proyeccion?.id;
  }

  cerrarModal(): void {
    this.activeModal.close();
  }

  aceptar(): void {
    if (this.aforoSeleccionado === undefined) {
      alert('No ha seleccionado ninguna butaca');
      return;
    }
    for (const aforo of this.aforoSeleccionado) {
      aforo.reservada = true;
    }

    this.servicioGeneral.setAforo(this.aforoSeleccionado);
    this.activeModal.close();

    this.navegar.navigate(['formulario']);
  }

  recuperarAforo(aforos: IAforo[]): void {
    this.aforoSeleccionado = aforos;
  }
}
