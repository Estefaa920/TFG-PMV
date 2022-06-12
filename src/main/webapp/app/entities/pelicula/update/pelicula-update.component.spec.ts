import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PeliculaService } from '../service/pelicula.service';
import { IPelicula, Pelicula } from '../pelicula.model';

import { PeliculaUpdateComponent } from './pelicula-update.component';

describe('Pelicula Management Update Component', () => {
  let comp: PeliculaUpdateComponent;
  let fixture: ComponentFixture<PeliculaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let peliculaService: PeliculaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PeliculaUpdateComponent],
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
      .overrideTemplate(PeliculaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PeliculaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    peliculaService = TestBed.inject(PeliculaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const pelicula: IPelicula = { id: 456 };

      activatedRoute.data = of({ pelicula });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(pelicula));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Pelicula>>();
      const pelicula = { id: 123 };
      jest.spyOn(peliculaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pelicula });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pelicula }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(peliculaService.update).toHaveBeenCalledWith(pelicula);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Pelicula>>();
      const pelicula = new Pelicula();
      jest.spyOn(peliculaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pelicula });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pelicula }));
      saveSubject.complete();

      // THEN
      expect(peliculaService.create).toHaveBeenCalledWith(pelicula);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Pelicula>>();
      const pelicula = { id: 123 };
      jest.spyOn(peliculaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pelicula });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(peliculaService.update).toHaveBeenCalledWith(pelicula);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
