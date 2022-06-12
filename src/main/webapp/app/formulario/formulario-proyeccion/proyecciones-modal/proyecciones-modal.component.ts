import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IProyeccion, Proyeccion } from 'app/entities/proyeccion/proyeccion.model';
import { ProyeccionService } from 'app/entities/proyeccion/service/proyeccion.service';
import { GeneralService } from 'app/formulario/service/formulario-general.service';
import dayjs from 'dayjs';
import { ISala } from '../../../entities/sala/sala.model';

@Component({
  selector: 'jhi-sesionmodal',
  templateUrl: './proyecciones-modal.component.html',
})
export class ModalComponent implements OnInit {
  proyecciones!: IProyeccion[];
  pelicula_id!: number;
  pelicula_nombre!: string;
  boton = false;
  indiceArrayProyeccnion?: number;
  salaSeleccionada?: ISala;
  proyeccionSelecionada?: IProyeccion;

  constructor(
    public activeModal: NgbActiveModal,
    public servicioGeneral: GeneralService,
    protected proyeccionService: ProyeccionService,
    protected router: Router
  ) {}
  ngOnInit(): void {
    this.proyeccionService.findByPeliculaId(this.pelicula_id).subscribe({
      next: (res: HttpResponse<IProyeccion[]>) => {
        this.proyecciones = res.body ?? [];
      },
    });
  }

  formatDate(proyeccion: Proyeccion): any {
    return dayjs(proyeccion.fecha).format('DD/MMM/YY HH:mm');
  }

  cerrarModal(guardar: boolean): void {
    if (guardar) {
      this.servicioGeneral.setProyeccion(this.proyeccionSelecionada!);
      this.activeModal.close();
    } else {
      this.activeModal.close();
    }
  }

  seleccionarPelicula(indice: any): void {
    this.boton = true;
    this.proyeccionSelecionada = this.proyecciones[indice];
    this.salaSeleccionada = this.proyecciones[indice].sala!;
  }
}
