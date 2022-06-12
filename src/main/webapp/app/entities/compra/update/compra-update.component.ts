import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICompra, Compra } from '../compra.model';
import { CompraService } from '../service/compra.service';
import { IProyeccion } from 'app/entities/proyeccion/proyeccion.model';
import { ProyeccionService } from 'app/entities/proyeccion/service/proyeccion.service';

@Component({
  selector: 'jhi-compra-update',
  templateUrl: './compra-update.component.html',
})
export class CompraUpdateComponent implements OnInit {
  isSaving = false;

  proyeccionsSharedCollection: IProyeccion[] = [];

  editForm = this.fb.group({
    id: [],
    nombre: [null, [Validators.required]],
    dni: [null, [Validators.required]],
    precioTotal: [null, [Validators.required]],
    proyeccion: [],
  });

  constructor(
    protected compraService: CompraService,
    protected proyeccionService: ProyeccionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ compra }) => {
      this.updateForm(compra);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const compra = this.createFromForm();
    if (compra.id !== undefined) {
      this.subscribeToSaveResponse(this.compraService.update(compra));
    } else {
      this.subscribeToSaveResponse(this.compraService.create(compra));
    }
  }

  trackProyeccionById(index: number, item: IProyeccion): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICompra>>): void {
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

  protected updateForm(compra: ICompra): void {
    this.editForm.patchValue({
      id: compra.id,
      nombre: compra.nombre,
      dni: compra.dni,
      precioTotal: compra.precioTotal,
      proyeccion: compra.proyeccion,
    });

    this.proyeccionsSharedCollection = this.proyeccionService.addProyeccionToCollectionIfMissing(
      this.proyeccionsSharedCollection,
      compra.proyeccion
    );
  }

  protected loadRelationshipsOptions(): void {
    this.proyeccionService
      .query()
      .pipe(map((res: HttpResponse<IProyeccion[]>) => res.body ?? []))
      .pipe(
        map((proyeccions: IProyeccion[]) =>
          this.proyeccionService.addProyeccionToCollectionIfMissing(proyeccions, this.editForm.get('proyeccion')!.value)
        )
      )
      .subscribe((proyeccions: IProyeccion[]) => (this.proyeccionsSharedCollection = proyeccions));
  }

  protected createFromForm(): ICompra {
    return {
      ...new Compra(),
      id: this.editForm.get(['id'])!.value,
      nombre: this.editForm.get(['nombre'])!.value,
      dni: this.editForm.get(['dni'])!.value,
      precioTotal: this.editForm.get(['precioTotal'])!.value,
      proyeccion: this.editForm.get(['proyeccion'])!.value,
    };
  }
}
