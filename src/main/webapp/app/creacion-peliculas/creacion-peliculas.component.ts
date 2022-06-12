import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { IPelicula } from 'app/entities/pelicula/pelicula.model';
import { PeliculaService } from 'app/entities/pelicula/service/pelicula.service';

@Component({
  selector: 'jhi-creacion-peliculas',
  templateUrl: './creacion-peliculas.component.html',
  styleUrls: ['./creacion-peliculas.component.scss'],
})
export class CreacionPeliculasComponent {
  lista_errores: string[] = [];
  titulo_pelicula = '';
  descripcion_pelicula = '';
  duracion_pelicula = 0;
  carga_correcta = false;
  // Url? genero?

  constructor(public peliculaService: PeliculaService) {
    this.titulo_pelicula = '';
  }

  guardarPelicula(): void {
    if (this.titulo_pelicula === '') {
      this.lista_errores.push('El nombre de la pelicula no puede estar vacio');
    }
    if (this.descripcion_pelicula === '') {
      this.lista_errores.push('La descripcion de la pelicula no puede estar vacio');
    }
    if (this.duracion_pelicula <= 0) {
      this.lista_errores.push('Duracion de pelicula incorrecto');
    }

    if (this.lista_errores.length === 0) {
      const nueva_pelicula: IPelicula = {
        nombre: this.titulo_pelicula,
        descripcion: this.descripcion_pelicula,
        duracion: this.duracion_pelicula,
        enCartelera: true,
        url: '',
        idApi: 0,
      };
      this.peliculaService.create(nueva_pelicula).subscribe({
        next: () => {
          this.carga_correcta = true;
        },
      });
    }
  }
}
