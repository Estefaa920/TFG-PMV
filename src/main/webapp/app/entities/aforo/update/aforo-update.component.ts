import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAforo, Aforo } from '../aforo.model';
import { AforoService } from '../service/aforo.service';
import { IProyeccion } from 'app/entities/proyeccion/proyeccion.model';
import { ProyeccionService } from 'app/entities/proyeccion/service/proyeccion.service';
import { ICompra } from 'app/entities/compra/compra.model';
import { CompraService } from 'app/entities/compra/service/compra.service';
import { IButaca } from 'app/entities/butaca/butaca.model';
import { ButacaService } from 'app/entities/butaca/service/butaca.service';

@Component({
  selector: 'jhi-aforo-update',
  templateUrl: './aforo-update.component.html',
})
export class AforoUpdateComponent implements OnInit {
  isSaving = false;

  proyeccionsSharedCollection: IProyeccion[] = [];
  comprasSharedCollection: ICompra[] = [];
  butacasSharedCollection: IButaca[] = [];

  editForm = this.fb.group({
    id: [],
    reservada: [null, [Validators.required]],
    proyeccion: [],
    compra: [],
    butaca: [],
  });

  constructor(
    protected aforoService: AforoService,
    protected proyeccionService: ProyeccionService,
    protected compraService: CompraService,
    protected butacaService: ButacaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ aforo }) => {
      this.updateForm(aforo);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const aforo = this.createFromForm();
    if (aforo.id !== undefined) {
      this.subscribeToSaveResponse(this.aforoService.update(aforo));
    } else {
      this.subscribeToSaveResponse(this.aforoService.create(aforo));
    }
  }

  trackProyeccionById(index: number, item: IProyeccion): number {
    return item.id!;
  }

  trackCompraById(index: number, item: ICompra): number {
    return item.id!;
  }

  trackButacaById(index: number, item: IButaca): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAforo>>): void {
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

  protected updateForm(aforo: IAforo): void {
    this.editForm.patchValue({
      id: aforo.id,
      reservada: aforo.reservada,
      proyeccion: aforo.proyeccion,
      compra: aforo.compra,
      butaca: aforo.butaca,
    });

    this.proyeccionsSharedCollection = this.proyeccionService.addProyeccionToCollectionIfMissing(
      this.proyeccionsSharedCollection,
      aforo.proyeccion
    );
    this.comprasSharedCollection = this.compraService.addCompraToCollectionIfMissing(this.comprasSharedCollection, aforo.compra);
    this.butacasSharedCollection = this.butacaService.addButacaToCollectionIfMissing(this.butacasSharedCollection, aforo.butaca);
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

    this.compraService
      .query()
      .pipe(map((res: HttpResponse<ICompra[]>) => res.body ?? []))
      .pipe(map((compras: ICompra[]) => this.compraService.addCompraToCollectionIfMissing(compras, this.editForm.get('compra')!.value)))
      .subscribe((compras: ICompra[]) => (this.comprasSharedCollection = compras));

    this.butacaService
      .query()
      .pipe(map((res: HttpResponse<IButaca[]>) => res.body ?? []))
      .pipe(map((butacas: IButaca[]) => this.butacaService.addButacaToCollectionIfMissing(butacas, this.editForm.get('butaca')!.value)))
      .subscribe((butacas: IButaca[]) => (this.butacasSharedCollection = butacas));
  }

  protected createFromForm(): IAforo {
    return {
      ...new Aforo(),
      id: this.editForm.get(['id'])!.value,
      reservada: this.editForm.get(['reservada'])!.value,
      proyeccion: this.editForm.get(['proyeccion'])!.value,
      compra: this.editForm.get(['compra'])!.value,
      butaca: this.editForm.get(['butaca'])!.value,
    };
  }
}
