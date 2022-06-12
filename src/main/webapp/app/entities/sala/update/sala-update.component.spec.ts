import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SalaService } from '../service/sala.service';
import { ISala, Sala } from '../sala.model';

import { SalaUpdateComponent } from './sala-update.component';

describe('Sala Management Update Component', () => {
  let comp: SalaUpdateComponent;
  let fixture: ComponentFixture<SalaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let salaService: SalaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SalaUpdateComponent],
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
      .overrideTemplate(SalaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SalaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    salaService = TestBed.inject(SalaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const sala: ISala = { id: 456 };

      activatedRoute.data = of({ sala });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(sala));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Sala>>();
      const sala = { id: 123 };
      jest.spyOn(salaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sala });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sala }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(salaService.update).toHaveBeenCalledWith(sala);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Sala>>();
      const sala = new Sala();
      jest.spyOn(salaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sala });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sala }));
      saveSubject.complete();

      // THEN
      expect(salaService.create).toHaveBeenCalledWith(sala);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Sala>>();
      const sala = { id: 123 };
      jest.spyOn(salaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sala });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(salaService.update).toHaveBeenCalledWith(sala);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
