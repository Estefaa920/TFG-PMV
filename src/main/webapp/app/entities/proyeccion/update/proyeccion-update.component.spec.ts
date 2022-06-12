import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProyeccionService } from '../service/proyeccion.service';
import { IProyeccion, Proyeccion } from '../proyeccion.model';
import { IPelicula } from 'app/entities/pelicula/pelicula.model';
import { PeliculaService } from 'app/entities/pelicula/service/pelicula.service';
import { ISala } from 'app/entities/sala/sala.model';
import { SalaService } from 'app/entities/sala/service/sala.service';

import { ProyeccionUpdateComponent } from './proyeccion-update.component';

describe('Proyeccion Management Update Component', () => {
  let comp: ProyeccionUpdateComponent;
  let fixture: ComponentFixture<ProyeccionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let proyeccionService: ProyeccionService;
  let peliculaService: PeliculaService;
  let salaService: SalaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProyeccionUpdateComponent],
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
      .overrideTemplate(ProyeccionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProyeccionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    proyeccionService = TestBed.inject(ProyeccionService);
    peliculaService = TestBed.inject(PeliculaService);
    salaService = TestBed.inject(SalaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Pelicula query and add missing value', () => {
      const proyeccion: IProyeccion = { id: 456 };
      const pelicula: IPelicula = { id: 9835 };
      proyeccion.pelicula = pelicula;

      const peliculaCollection: IPelicula[] = [{ id: 28985 }];
      jest.spyOn(peliculaService, 'query').mockReturnValue(of(new HttpResponse({ body: peliculaCollection })));
      const additionalPeliculas = [pelicula];
      const expectedCollection: IPelicula[] = [...additionalPeliculas, ...peliculaCollection];
      jest.spyOn(peliculaService, 'addPeliculaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ proyeccion });
      comp.ngOnInit();

      expect(peliculaService.query).toHaveBeenCalled();
      expect(peliculaService.addPeliculaToCollectionIfMissing).toHaveBeenCalledWith(peliculaCollection, ...additionalPeliculas);
      expect(comp.peliculasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Sala query and add missing value', () => {
      const proyeccion: IProyeccion = { id: 456 };
      const sala: ISala = { id: 16586 };
      proyeccion.sala = sala;

      const salaCollection: ISala[] = [{ id: 22388 }];
      jest.spyOn(salaService, 'query').mockReturnValue(of(new HttpResponse({ body: salaCollection })));
      const additionalSalas = [sala];
      const expectedCollection: ISala[] = [...additionalSalas, ...salaCollection];
      jest.spyOn(salaService, 'addSalaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ proyeccion });
      comp.ngOnInit();

      expect(salaService.query).toHaveBeenCalled();
      expect(salaService.addSalaToCollectionIfMissing).toHaveBeenCalledWith(salaCollection, ...additionalSalas);
      expect(comp.salasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const proyeccion: IProyeccion = { id: 456 };
      const pelicula: IPelicula = { id: 45350 };
      proyeccion.pelicula = pelicula;
      const sala: ISala = { id: 23729 };
      proyeccion.sala = sala;

      activatedRoute.data = of({ proyeccion });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(proyeccion));
      expect(comp.peliculasSharedCollection).toContain(pelicula);
      expect(comp.salasSharedCollection).toContain(sala);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Proyeccion>>();
      const proyeccion = { id: 123 };
      jest.spyOn(proyeccionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ proyeccion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: proyeccion }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(proyeccionService.update).toHaveBeenCalledWith(proyeccion);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Proyeccion>>();
      const proyeccion = new Proyeccion();
      jest.spyOn(proyeccionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ proyeccion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: proyeccion }));
      saveSubject.complete();

      // THEN
      expect(proyeccionService.create).toHaveBeenCalledWith(proyeccion);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Proyeccion>>();
      const proyeccion = { id: 123 };
      jest.spyOn(proyeccionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ proyeccion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(proyeccionService.update).toHaveBeenCalledWith(proyeccion);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackPeliculaById', () => {
      it('Should return tracked Pelicula primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPeliculaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackSalaById', () => {
      it('Should return tracked Sala primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSalaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
