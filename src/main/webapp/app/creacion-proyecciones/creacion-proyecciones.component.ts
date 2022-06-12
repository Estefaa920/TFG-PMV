import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { IPelicula } from 'app/entities/pelicula/pelicula.model';
import { PeliculaService } from 'app/entities/pelicula/service/pelicula.service';
import { IProyeccion } from 'app/entities/proyeccion/proyeccion.model';
import { ProyeccionService } from 'app/entities/proyeccion/service/proyeccion.service';
import { ISala } from 'app/entities/sala/sala.model';
import { SalaService } from 'app/entities/sala/service/sala.service';
import dayjs from 'dayjs/esm';

@Component({
  selector: 'jhi-creacion-proyecciones',
  templateUrl: './creacion-proyecciones.component.html',
  styleUrls: ['./creacion-proyecciones.component.scss'],
})
export class CreacionProyeccionesComponent {
  titulo: any;
  pelicula_seleccionada?: IPelicula = undefined;
  sala_seleccionada?: ISala = undefined;
  lista_salas: ISala[] = [];
  lista_peliculas: IPelicula[] = [];

  hora_proyeccion = '';
  fecha_proyeccion = '';
  precio = 0;

  lista_errores: string[] = [];
  correcto = false;

  constructor(public salaService: SalaService, public proyeccionService: ProyeccionService, public peliculaService: PeliculaService) {
    this.titulo = '';
    this.salaService.query().subscribe({
      next: (res: HttpResponse<ISala[]>) => {
        this.lista_salas = res.body ?? [];
      },
    });

    this.peliculaService.cargarEnEstreno().subscribe({
      next: (res: HttpResponse<IPelicula[]>) => {
        this.lista_peliculas = res.body ?? [];
      },
    });
  }

  // pablo -- Hay que corregir esto para que muestre los errores
  guardar(): void {
    if (this.pelicula_seleccionada !== undefined) {
      try {
        const dia = parseInt(this.fecha_proyeccion.split('-')[0], 10);
        const mes = parseInt(this.fecha_proyeccion.split('-')[1], 10);
        const año = parseInt(this.fecha_proyeccion.split('-')[2], 10);

        const hora = parseInt(this.hora_proyeccion.split(':')[0], 10);
        const minutos = parseInt(this.hora_proyeccion.split(':')[1], 10);
        const date = dayjs()
          .year(año)
          .month(mes - 1)
          .date(dia)
          .set('hours', hora + 1)
          .set('minutes', minutos);

        const nueva_proyeccion: IProyeccion = {
          fecha: date,
          sala: this.sala_seleccionada,
          precio: this.precio,
          pelicula: this.pelicula_seleccionada,
        };
        this.proyeccionService.create(nueva_proyeccion).subscribe({
          next: resp => {
            /*if(resp === null || resp!==undefined){
              alert('no se pudo guardar la proyeccion');
              this.correcto = false;
              return;
            }
            */
            this.correcto = true;
          },
        });
      } catch (error) {
        this.lista_errores.push('Error al rellenar los campos');
      }
    }
  }
}
