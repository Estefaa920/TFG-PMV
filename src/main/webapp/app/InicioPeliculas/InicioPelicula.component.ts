import { Component } from '@angular/core';
import { CarterelaResponse, Movie } from './interfaces/carterela-resonse';
import { PeliculasAPIService } from './services/peliculasAPI.service';
import { IPelicula } from '../entities/pelicula/pelicula.model';
import { PeliculaService } from '../entities/pelicula/service/pelicula.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-inicio-pelicula',
  templateUrl: './inicio-pelicula.component.html',
})
export class InicioPeliculaComponent {
  public movies: IPelicula[] = [];
  isLoading = false;

  constructor(private peliculaServiceApi: PeliculasAPIService, private peliculaService: PeliculaService) {
    /*this.peliculaServiceApi.getCarteleraAPI().subscribe((resp: CarterelaResponse) => {
      this.movies = resp.results;
    });*/
  }
}
