import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IAforo } from 'app/entities/aforo/aforo.model';
import { IPelicula } from 'app/entities/pelicula/pelicula.model';
import { PeliculaService } from 'app/entities/pelicula/service/pelicula.service';
import { IProyeccion } from 'app/entities/proyeccion/proyeccion.model';
import dayjs from 'dayjs';
import { GeneralService } from '../service/formulario-general.service';
import { ModalComponent } from './proyecciones-modal/proyecciones-modal.component';

@Component({
  selector: 'jhi-formulario-proyeccion',
  templateUrl: './formulario-proyeccion.component.html',
  styleUrls: ['../formulario.component.scss'],
})
export class FormularioProyeccionComponent {
  @Output() proyeccionEmitter: EventEmitter<IProyeccion> = new EventEmitter();

  titulo = 'Cartelera';

  peliculas?: IPelicula[];
  proyecciones?: IProyeccion[];
  isLoading = false;
  proyeccionSeleccionada?: IProyeccion;
  lista_aforo: IAforo[] = [];
  pelicula?: IPelicula;
  nombre_pelicula = '';
  seleccionPrevia = false;

  constructor(private modalService: NgbModal, protected peliculaService: PeliculaService, public servicioGeneral: GeneralService) {
    this.loadAll();
    this.proyeccionSeleccionada = servicioGeneral.getProyeccion();
    this.lista_aforo = servicioGeneral.getAforo();
    this.verificar();
  }

  verificar(): void {
    if (this.proyeccionSeleccionada !== undefined) {
      this.seleccionPrevia = true;
    }
  }

  openModal(pelicula_id: number, pelicula_nombre: string): void {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.pelicula_id = pelicula_id;
    modalRef.componentInstance.pelicula_nombre = pelicula_nombre;
  }

  loadAll(): void {
    this.peliculaService.cargarEnEstreno().subscribe({
      next: (res: HttpResponse<IPelicula[]>) => {
        this.isLoading = false;
        this.peliculas = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  trackId(index: number, item: IPelicula): number {
    return item.id!;
  }

  actualizarLista(nombre: string): void {
    this.isLoading = true;

    this.peliculaService.loadByname(nombre).subscribe({
      next: (res: HttpResponse<IPelicula[]>) => {
        this.isLoading = false;
        this.peliculas = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  actualizarNombre(): void {
    if (this.nombre_pelicula === '') {
      this.loadAll();
    } else {
      this.actualizarLista(this.nombre_pelicula);
    }
  }

  formatDate(proyeccion: IProyeccion): any {
    return dayjs(proyeccion.fecha).format('DD/MMM/YY HH:mm');
  }
}
