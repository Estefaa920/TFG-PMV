import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPelicula, Pelicula } from '../pelicula.model';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { PeliculaService } from '../service/pelicula.service';
import { PeliculaDeleteDialogComponent } from '../delete/pelicula-delete-dialog.component';
import { PeliculasAPIService } from '../../../InicioPeliculas/services/peliculasAPI.service';
import { Movie, CarterelaResponse } from '../../../InicioPeliculas/interfaces/carterela-resonse';

@Component({
  selector: 'jhi-pelicula',
  templateUrl: './pelicula.component.html',
})
export class PeliculaComponent implements OnInit {
  peliculas?: IPelicula[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  movies?: Movie[];
  nuevasPeliculas2: IPelicula[] = [];
  noCartelera: IPelicula[] = [];
  errorBaseDatos = false;
  peliculas2?: IPelicula[];

  carga_correcta = false;

  constructor(
    protected peliculaService: PeliculaService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    protected serciosApi: PeliculasAPIService
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.peliculaService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<IPelicula[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
          this.errorBaseDatos = false;
        },
        error: () => {
          this.isLoading = false;
          this.errorBaseDatos = true;
          this.onError();
        },
      });

    this.peliculaService.cargarPelicula().subscribe({
      next: (res: HttpResponse<IPelicula[]>) => {
        this.peliculas2 = res.body ?? [];
        this.errorBaseDatos = false;
      },
      error: () => {
        this.errorBaseDatos = true;
      },
    });
  }

  ngOnInit(): void {
    this.handleNavigation();
  }

  trackId(index: number, item: IPelicula): number {
    return item.id!;
  }

  delete(pelicula: IPelicula): void {
    const modalRef = this.modalService.open(PeliculaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.pelicula = pelicula;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  actualizarCartelera(): void {
    this.serciosApi.getCarteleraAPI().subscribe((resp: CarterelaResponse) => {
      this.movies = resp.results;
      if (this.peliculas2 !== undefined && this.peliculas2.length !== 0) {
        for (const peliculaApi of this.movies) {
          for (let i = 0; i < this.peliculas2.length; i++) {
            if (peliculaApi.title.toString() !== this.peliculas2[i].nombre?.toString()) {
              if (i === this.peliculas2.length - 1) {
                const nuevaPelicula: IPelicula = {
                  nombre: peliculaApi.title,
                  descripcion: peliculaApi.overview,
                  duracion: 145,
                  enCartelera: false,
                  url: peliculaApi.poster_path,
                  idApi: peliculaApi.id,
                };
                this.nuevasPeliculas2.push(nuevaPelicula);
              }
            } else {
              break;
            }
          }
        }
        if (this.nuevasPeliculas2.length !== 0) {
          for (const peliculaN of this.nuevasPeliculas2) {
            this.peliculaService.create(peliculaN).subscribe({
              next: () => {
                this.carga_correcta = true;
              },
            });
          }
        } else {
          alert('No hay actualizaciones');
        }
      } else if (!this.errorBaseDatos) {
        for (const peliculaN of this.movies) {
          const nuevaPelicula: IPelicula = {
            nombre: peliculaN.title,
            descripcion: peliculaN.overview,
            duracion: 145,
            enCartelera: false,
            url: peliculaN.poster_path,
            idApi: peliculaN.id,
          };
          this.peliculaService.create(nuevaPelicula).subscribe({
            next: () => {
              this.carga_correcta = true;
            },
          });
        }
      }
    });
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? ASC : DESC)];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      const pageNumber = +(page ?? 1);
      const sort = (params.get(SORT) ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === ASC;
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
      }
    });
  }

  protected onSuccess(data: IPelicula[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;

    if (navigate) {
      this.router.navigate(['/pelicula'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.peliculas = data ?? [];

    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
