import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IButaca, Butaca } from '../butaca.model';
import { ButacaService } from '../service/butaca.service';
import { ISala } from 'app/entities/sala/sala.model';
import { SalaService } from 'app/entities/sala/service/sala.service';

@Component({
  selector: 'jhi-butaca-update',
  templateUrl: './butaca-update.component.html',
})
export class ButacaUpdateComponent implements OnInit {
  isSaving = false;

  salasSharedCollection: ISala[] = [];

  editForm = this.fb.group({
    id: [],
    posicion: [null, [Validators.required]],
    premium: [null, [Validators.required]],
    sala: [],
  });

  constructor(
    protected butacaService: ButacaService,
    protected salaService: SalaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ butaca }) => {
      this.updateForm(butaca);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const butaca = this.createFromForm();
    if (butaca.id !== undefined) {
      this.subscribeToSaveResponse(this.butacaService.update(butaca));
    } else {
      this.subscribeToSaveResponse(this.butacaService.create(butaca));
    }
  }

  trackSalaById(index: number, item: ISala): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IButaca>>): void {
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

  protected updateForm(butaca: IButaca): void {
    this.editForm.patchValue({
      id: butaca.id,
      posicion: butaca.posicion,
      premium: butaca.premium,
      sala: butaca.sala,
    });

    this.salasSharedCollection = this.salaService.addSalaToCollectionIfMissing(this.salasSharedCollection, butaca.sala);
  }

  protected loadRelationshipsOptions(): void {
    this.salaService
      .query()
      .pipe(map((res: HttpResponse<ISala[]>) => res.body ?? []))
      .pipe(map((salas: ISala[]) => this.salaService.addSalaToCollectionIfMissing(salas, this.editForm.get('sala')!.value)))
      .subscribe((salas: ISala[]) => (this.salasSharedCollection = salas));
  }

  protected createFromForm(): IButaca {
    return {
      ...new Butaca(),
      id: this.editForm.get(['id'])!.value,
      posicion: this.editForm.get(['posicion'])!.value,
      premium: this.editForm.get(['premium'])!.value,
      sala: this.editForm.get(['sala'])!.value,
    };
  }
}
