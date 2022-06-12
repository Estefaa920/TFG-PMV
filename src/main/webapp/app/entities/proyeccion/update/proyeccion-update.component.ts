import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IProyeccion, Proyeccion } from '../proyeccion.model';
import { ProyeccionService } from '../service/proyeccion.service';
import { IPelicula } from 'app/entities/pelicula/pelicula.model';
import { PeliculaService } from 'app/entities/pelicula/service/pelicula.service';
import { ISala } from 'app/entities/sala/sala.model';
import { SalaService } from 'app/entities/sala/service/sala.service';

@Component({
  selector: 'jhi-proyeccion-update',
  templateUrl: './proyeccion-update.component.html',
})
export class ProyeccionUpdateComponent implements OnInit {
  isSaving = false;

  peliculasSharedCollection: IPelicula[] = [];
  salasSharedCollection: ISala[] = [];

  editForm = this.fb.group({
    id: [],
    fecha: [null, [Validators.required]],
    precio: [null, [Validators.required]],
    pelicula: [],
    sala: [],
  });

  constructor(
    protected proyeccionService: ProyeccionService,
    protected peliculaService: PeliculaService,
    protected salaService: SalaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ proyeccion }) => {
      if (proyeccion.id === undefined) {
        const today = dayjs().startOf('day');
        proyeccion.fecha = today;
      }

      this.updateForm(proyeccion);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const proyeccion = this.createFromForm();
    if (proyeccion.id !== undefined) {
      this.subscribeToSaveResponse(this.proyeccionService.update(proyeccion));
    } else {
      this.subscribeToSaveResponse(this.proyeccionService.create(proyeccion));
    }
  }

  trackPeliculaById(index: number, item: IPelicula): number {
    return item.id!;
  }

  trackSalaById(index: number, item: ISala): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProyeccion>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(proyeccion: IProyeccion): void {
    this.editForm.patchValue({
      id: proyeccion.id,
      fecha: proyeccion.fecha ? proyeccion.fecha.format(DATE_TIME_FORMAT) : null,
      precio: proyeccion.precio,
      pelicula: proyeccion.pelicula,
      sala: proyeccion.sala,
    });

    this.peliculasSharedCollection = this.peliculaService.addPeliculaToCollectionIfMissing(
      this.peliculasSharedCollection,
      proyeccion.pelicula
    );
    this.salasSharedCollection = this.salaService.addSalaToCollectionIfMissing(this.salasSharedCollection, proyeccion.sala);
  }

  protected loadRelationshipsOptions(): void {
    this.peliculaService
      .query()
      .pipe(map((res: HttpResponse<IPelicula[]>) => res.body ?? []))
      .pipe(
        map((peliculas: IPelicula[]) =>
          this.peliculaService.addPeliculaToCollectionIfMissing(peliculas, this.editForm.get('pelicula')!.value)
        )
      )
      .subscribe((peliculas: IPelicula[]) => (this.peliculasSharedCollection = peliculas));

    this.salaService
      .query()
      .pipe(map((res: HttpResponse<ISala[]>) => res.body ?? []))
      .pipe(map((salas: ISala[]) => this.salaService.addSalaToCollectionIfMissing(salas, this.editForm.get('sala')!.value)))
      .subscribe((salas: ISala[]) => (this.salasSharedCollection = salas));
  }

  protected createFromForm(): IProyeccion {
    return {
      ...new Proyeccion(),
      id: this.editForm.get(['id'])!.value,
      fecha: this.editForm.get(['fecha'])!.value ? dayjs(this.editForm.get(['fecha'])!.value, DATE_TIME_FORMAT) : undefined,
      precio: this.editForm.get(['precio'])!.value,
      pelicula: this.editForm.get(['pelicula'])!.value,
      sala: this.editForm.get(['sala'])!.value,
    };
  }
}
