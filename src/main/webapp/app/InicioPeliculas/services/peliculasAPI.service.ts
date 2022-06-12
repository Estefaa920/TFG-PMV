import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { CarterelaResponse } from '../interfaces/carterela-resonse';
import { MovieResponse } from '../interfaces/movie-response';
import { Cast, CreditResponse } from '../interfaces/credit-response';

@Injectable({
  providedIn: 'root',
})
export class PeliculasAPIService {
  constructor(private http: HttpClient) {}

  getCarteleraAPI(): Observable<CarterelaResponse> {
    return this.http.get<CarterelaResponse>(
      'https://api.themoviedb.org/3/movie/now_playing?api_key=bedc661e9698dfa7b5b76bafa096f48a&language=es-ES&page=1'
    );
  }

  getPeliculaDetalle(id: string): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`https://api.themoviedb.org/3/movie/${id}?api_key=bedc661e9698dfa7b5b76bafa096f48a&language=es-ES`);
  }

  getCast(id: string): Observable<CreditResponse> {
    return this.http.get<CreditResponse>(
      `https://api.themoviedb.org/3/movie/${id}/credits?api_key=bedc661e9698dfa7b5b76bafa096f48a&language=es-ES`
    );
  }
}
