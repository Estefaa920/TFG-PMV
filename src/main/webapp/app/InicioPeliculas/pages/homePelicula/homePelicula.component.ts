import { Component } from '@angular/core';
import { Movie } from 'app/InicioPeliculas/interfaces/carterela-resonse';

@Component({
  selector: 'jhi-home-pelicula',
  templateUrl: './homePelicula.component.html',
  styleUrls: ['./homePeliculas.component.css'],
})
export class HomePeliculaComponent {
  public movies: Movie[] = [];
  public moviesSlideshow: Movie[] = [];
}
