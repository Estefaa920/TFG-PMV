import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IPelicula } from 'app/entities/pelicula/pelicula.model';
import { PeliculaService } from 'app/entities/pelicula/service/pelicula.service';
import { IProyeccion } from 'app/entities/proyeccion/proyeccion.model';
import { ISala } from 'app/entities/sala/sala.model';
import dayjs from 'dayjs';
import { ProyeccionService } from '../../entities/proyeccion/service/proyeccion.service';
import { AforoService } from '../../entities/aforo/service/aforo.service';
import { IAforo } from '../../entities/aforo/aforo.model';
import { ReservaModalComponent } from '../../reserva/reserva-modal/reserva-modal.component';
import { GeneralService } from '../../formulario/service/formulario-general.service';
import { servicesVersion } from 'typescript';

@Component({
  selector: 'jhi-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent {
  @Output() proyeccionEmitter: EventEmitter<IProyeccion> = new EventEmitter();

  titulo = 'Cartelera';

  peliculas?: IPelicula[];
  proyecciones?: IProyeccion[];
  isLoading = false;
  proyeccionSeleccionada?: IProyeccion;
  pelicula_id?: number;
  salaSeleccionada?: ISala;
  proyeccionSelecionada?: IProyeccion;
  numeroProyeccion?: number;
  butacasAforo?: IAforo[];

  nombre_pelicula = '';

  buscarProyeccion = false;

  constructor(
    private modalService: NgbModal,
    protected peliculaService: PeliculaService,
    protected proyeccionService: ProyeccionService,
    protected aforoService: AforoService,
    protected servicioGeneral: GeneralService
  ) {
    this.loadAll();
  }

  openModal(id_proyeccion: IProyeccion): void {
    const modalRef = this.modalService.open(ReservaModalComponent, { size: 'xl', backdrop: 'static' });
    modalRef.componentInstance.proyeccion = id_proyeccion;
    this.servicioGeneral.setProyeccion(id_proyeccion);
  }

  loadAll(): void {
    this.isLoading = true;

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
    this.actualizarLista(this.nombre_pelicula);
  }

  formatDate(proyeccion: IProyeccion): any {
    return dayjs(proyeccion.fecha).format('DD/MMM/YY');
  }

  formatDateHora(proyeccion: IProyeccion): any {
    return dayjs(proyeccion.fecha).format('HH:mm');
  }

  volver(): void {
    if (this.buscarProyeccion) {
      this.buscarProyeccion = false;
      return;
    }

    this.buscarProyeccion = true;
  }

  buscarProyeccionPelicula(pelicula_id: number): void {
    this.proyeccionService.findByPeliculaId(pelicula_id).subscribe({
      next: (res1: HttpResponse<IProyeccion[]>) => {
        this.proyecciones = res1.body ?? [];

        for (let i = 0; i < this.proyecciones.length; i++) {
          this.numeroProyeccion = this.proyecciones[i].id;

          this.aforoService
            .query2({
              numeroProyeccion: this.numeroProyeccion,
            })
            .subscribe({
              next: (res: HttpResponse<IAforo[]>) => {
                this.butacasAforo = res.body ?? [];
                let contador = 0;
                for (const aforo of this.butacasAforo) {
                  if (!aforo.reservada) {
                    contador++;
                  }
                }

                this.proyecciones![i].numeroDisponibles = contador;
              },
            });
        }

        if (this.proyecciones.length === 0) {
          alert('No hay proyecciones');
        } else {
          this.volver();
        }
      },
    });
  }

  buscar(pelicula: IPelicula): void {
    this.buscarProyeccionPelicula(pelicula.id!);
  }

  seleccionarPelicula(indice: any): void {
    this.proyeccionSelecionada = this.proyecciones![indice];
    this.salaSeleccionada = this.proyecciones![indice].sala!;
  }
}
