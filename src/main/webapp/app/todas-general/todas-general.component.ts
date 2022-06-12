import { HttpResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IPelicula } from 'app/entities/pelicula/pelicula.model';
import { PeliculaService } from 'app/entities/pelicula/service/pelicula.service';

import { CarterelaResponse, Movie } from 'app/InicioPeliculas/interfaces/carterela-resonse';

@Component({
  selector: 'jhi-todas-general',
  templateUrl: './todas-general.component.html',
  styleUrls: ['./todas-general.component.css'],
})
export class TodasGeneralComponent {
  movies?: IPelicula[];
  isLoading = false;

  constructor(private router: Router, private peliculaService: PeliculaService) {
    this.peliculaService.cargarEnEstreno().subscribe({
      next: (res: HttpResponse<IPelicula[]>) => {
        this.movies = res.body ?? [];
        this.isLoading = true;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  // ngOnInit(): void {

  // }

  onMovieClick(movie: IPelicula): void {
    this.router.navigate(['/pelicula', movie.idApi]);
  }
}
