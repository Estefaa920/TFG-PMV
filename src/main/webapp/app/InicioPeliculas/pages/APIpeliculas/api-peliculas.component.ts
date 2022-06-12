import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MovieResponse } from 'app/InicioPeliculas/interfaces/movie-response';
import { PeliculasAPIService } from 'app/InicioPeliculas/services/peliculasAPI.service';
import { Cast, CreditResponse } from 'app/InicioPeliculas/interfaces/credit-response';
import { FormBuilder, Validators } from '@angular/forms';
import { IPelicula } from 'app/entities/pelicula/pelicula.model';
import { IProyeccion, Proyeccion } from 'app/entities/proyeccion/proyeccion.model';
import dayjs, { Dayjs } from 'dayjs';
import { DATE_FORMAT } from 'app/config/input.constants';
import { Movie } from 'app/InicioPeliculas/interfaces/carterela-resonse';
import { ProyeccionService } from 'app/entities/proyeccion/service/proyeccion.service';

@Component({
  selector: 'jhi-api-peliculas',
  templateUrl: './api-peliculas.component.html',
  styleUrls: ['./api-peliculas.componet.scss'],
})
export class ApiPeliculasComponent implements OnInit {
  public pelicula?: MovieResponse;
  public cast: Cast[] = [];

  public titulo? = '';
  public dias = [1, 2, 3, 4, 5, 6];
  mostrar = false;

  movies: Movie[] = [];
  proyecciones?: IProyeccion[] = [];
  peliculaOrder: IPelicula[] = [];
  hoy = dayjs(new Date());
  minDate: any;
  maxDate: any;

  editForm = this.fb.group({
    fecha: [null, [Validators.required]],
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private peliculaService: PeliculasAPIService,
    private location: Location,
    private router: Router,
    protected fb: FormBuilder,
    private proyeccionService: ProyeccionService
  ) {
    dayjs()
      .year(2022)
      .month(8 - 1)
      .date(10);
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params.id;

    this.peliculaService.getPeliculaDetalle(id).subscribe((movie: MovieResponse) => {
      this.pelicula = movie;
    });

    this.peliculaService.getCast(id).subscribe((cast: CreditResponse) => {
      this.cast = cast.cast.filter(actor => actor.profile_path !== null);
    });
    this.updateForm(this.hoy);
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

  onRegresar(): void {
    this.location.back();
  }

  mostrarHorario(): void {
    this.buscarFecha();
    this.dias;
    this.titulo = this.pelicula?.title;
    this.mostrar = !this.mostrar;
  }

  ordenarPelicula(proyecciones: IProyeccion[]): void {
    this.proyecciones;
  }
  
  buscarFecha(): void {
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
        
      });
  }


}
