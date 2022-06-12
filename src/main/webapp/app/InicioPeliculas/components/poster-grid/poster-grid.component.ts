import { HttpResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import Swiper from 'swiper';
import { IPelicula } from '../../../entities/pelicula/pelicula.model';
import { PeliculaService } from '../../../entities/pelicula/service/pelicula.service';

@Component({
  selector: 'jhi-poster-grid',
  templateUrl: './poster-grid.component.html',
  styleUrls: ['./poster-grid.component.scss'],
})
export class PosterGridComponent {
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
  ngAfterViewInit(): void {
    const swiper = new Swiper('.swiper-container', {
      slidesPerView: 5.4,
      freeMode: true,
    });
  }
  // ngOnInit(): void {

  // }

  onMovieClick(movie: IPelicula): void {
    this.router.navigate(['/pelicula', movie.idApi]);
  }
}
