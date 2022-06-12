import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Proyeccion } from 'app/entities/proyeccion/proyeccion.model';
import { ProyeccionService } from 'app/entities/proyeccion/service/proyeccion.service';

import { CarterelaResponse, Movie } from 'app/InicioPeliculas/interfaces/carterela-resonse';
import { PeliculasAPIService } from 'app/InicioPeliculas/services/peliculasAPI.service';
import dayjs, { Dayjs } from 'dayjs/esm';
import { IProyeccion } from '../entities/proyeccion/proyeccion.model';
import { DATE_TIME_FORMAT, DATE_FORMAT } from '../config/input.constants';
import { IPelicula, Pelicula } from '../entities/pelicula/pelicula.model';

@Component({
  selector: 'jhi-venta-entradas',
  templateUrl: './venta-entradas.component.html',
  styleUrls: ['./venta-entradas.component.scss'],
})
export class VentaEntradasComponent implements OnInit {
  dias = [1, 2, 3, 4, 5, 6];
  movies: Movie[] = [];
  proyecciones?: IProyeccion[] = [];
  peliculaOrder: IPelicula[] = [];
  hoy = dayjs(new Date());

  minDate?: any;
  maxDate?: any;

  editForm = this.fb.group({
    fecha: [null, [Validators.required]],
  });

  constructor(private peliculaServiceApi: PeliculasAPIService,
    private router: Router,
    private proyeccionService: ProyeccionService,
    protected fb: FormBuilder,
    protected navegar: Router,) {


    this.peliculaServiceApi.getCarteleraAPI().subscribe((resp: CarterelaResponse) => {
     // this.movies = resp.results;
    });

    dayjs()
      .year(2022)
      .month(8 - 1)
      .date(10);
  }
  ngOnInit(): void {
    this.updateForm(this.hoy);
    this.buscarFecha(event);
    const currentYear = new Date().getFullYear();
    const currentDay = new Date().getDay();
    const currentMonth = new Date().getMonth();
    this.minDate = dayjs(new Date(currentYear, currentMonth, currentDay + 5)).format('YYYY-MM-DD');
    this.maxDate = dayjs(new Date(currentYear, currentMonth, currentDay + 19)).format('YYYY-MM-DD');
  }

  updateForm(fecha?: Dayjs): void {
    this.editForm.patchValue({
      fecha: fecha ? fecha.format(DATE_FORMAT) : null,
    });
  }

  formatDateDay(proyeccion: Proyeccion): any {
    return dayjs(proyeccion.fecha).format('DD/MMM/YY');
  }

  formatDateEntrada(proyeccion: Proyeccion): any {
    return dayjs(proyeccion.fecha).format('HH:mm');
  }

  onMovieClick(movie: IPelicula): void {
    this.router.navigate(['/pelicula', movie.idApi]);
  }

  

  buscarFecha(event: any): void {
    const date = new Date(this.editForm.get(['fecha'])!.value);
    const ceroOpcional = '0';
    const text =
      date.getFullYear().toString() +
      '-' +
      (date.getMonth() + 1 < 10 ? ceroOpcional + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString()).toString() +
      '-' +
      (date.getDate() < 10 ? ceroOpcional + date.getDate().toString() : date.getDate().toString()).toString();

    this.proyeccionService
      .findproyecionFecha({
        fecha: text,
      })
      .subscribe(resp => {
        this.proyecciones = resp.body ?? [];
        this.organizarPelicula(this.proyecciones);
      });
  }

  organizarPelicula(proyecciones: IProyeccion[]): void {
    this.peliculaOrder = [];

    for (const proyeccion of proyecciones) {
      const proyec: IProyeccion[] = [];
      if (this.peliculaOrder.length === 0) {
        const peliculaO: IPelicula = {
          id: proyeccion.pelicula?.id,
          nombre: proyeccion.pelicula?.nombre,
          descripcion: proyeccion.pelicula?.descripcion,
          enCartelera: proyeccion.pelicula?.enCartelera,
          url: proyeccion.pelicula?.url,
          idApi: proyeccion.pelicula?.idApi,
          proyeccions: proyec

        }


        peliculaO.proyeccions?.push(proyeccion);

        this.peliculaOrder.push(peliculaO);
      } else {

        for (let i = 0; i < this.peliculaOrder.length; i++) {

          if (this.peliculaOrder[i].id !== proyeccion.pelicula?.id) {
            if (i === (this.peliculaOrder.length - 1)) {
              const peliculaO: IPelicula = {
                id: proyeccion.pelicula?.id,
                nombre: proyeccion.pelicula?.nombre,
                descripcion: proyeccion.pelicula?.descripcion,
                enCartelera: proyeccion.pelicula?.enCartelera,
                url: proyeccion.pelicula?.url,
                idApi: proyeccion.pelicula?.idApi,
                proyeccions: proyec
              }

              peliculaO.proyeccions?.push(proyeccion);
              this.peliculaOrder.push(peliculaO);
              break;
            }

          } else if (this.peliculaOrder[i].id === proyeccion.pelicula?.id) {

            this.peliculaOrder[i].proyeccions?.push(proyeccion);
          }
        }
      }
    }



  }

  buscarProyeccion(proyeccion: IProyeccion): void {
    this.navegar.navigate(['/proyeccion/reserva', proyeccion.id, 'butacas']);

  }

}
