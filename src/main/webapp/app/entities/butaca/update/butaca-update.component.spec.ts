import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ButacaService } from '../service/butaca.service';
import { IButaca, Butaca } from '../butaca.model';
import { ISala } from 'app/entities/sala/sala.model';
import { SalaService } from 'app/entities/sala/service/sala.service';

import { ButacaUpdateComponent } from './butaca-update.component';

describe('Butaca Management Update Component', () => {
  let comp: ButacaUpdateComponent;
  let fixture: ComponentFixture<ButacaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let butacaService: ButacaService;
  let salaService: SalaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ButacaUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ButacaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ButacaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    butacaService = TestBed.inject(ButacaService);
    salaService = TestBed.inject(SalaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Sala query and add missing value', () => {
      const butaca: IButaca = { id: 456 };
      const sala: ISala = { id: 5659 };
      butaca.sala = sala;

      const salaCollection: ISala[] = [{ id: 30271 }];
      jest.spyOn(salaService, 'query').mockReturnValue(of(new HttpResponse({ body: salaCollection })));
      const additionalSalas = [sala];
      const expectedCollection: ISala[] = [...additionalSalas, ...salaCollection];
      jest.spyOn(salaService, 'addSalaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ butaca });
      comp.ngOnInit();

      expect(salaService.query).toHaveBeenCalled();
      expect(salaService.addSalaToCollectionIfMissing).toHaveBeenCalledWith(salaCollection, ...additionalSalas);
      expect(comp.salasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const butaca: IButaca = { id: 456 };
      const sala: ISala = { id: 81198 };
      butaca.sala = sala;

      activatedRoute.data = of({ butaca });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(butaca));
      expect(comp.salasSharedCollection).toContain(sala);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Butaca>>();
      const butaca = { id: 123 };
      jest.spyOn(butacaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ butaca });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: butaca }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(butacaService.update).toHaveBeenCalledWith(butaca);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Butaca>>();
      const butaca = new Butaca();
      jest.spyOn(butacaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ butaca });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: butaca }));
      saveSubject.complete();

      // THEN
      expect(butacaService.create).toHaveBeenCalledWith(butaca);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Butaca>>();
      const butaca = { id: 123 };
      jest.spyOn(butacaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ butaca });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(butacaService.update).toHaveBeenCalledWith(butaca);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackSalaById', () => {
      it('Should return tracked Sala primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSalaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
