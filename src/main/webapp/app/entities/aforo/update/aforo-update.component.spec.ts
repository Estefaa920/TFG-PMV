import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AforoService } from '../service/aforo.service';
import { IAforo, Aforo } from '../aforo.model';
import { IProyeccion } from 'app/entities/proyeccion/proyeccion.model';
import { ProyeccionService } from 'app/entities/proyeccion/service/proyeccion.service';
import { ICompra } from 'app/entities/compra/compra.model';
import { CompraService } from 'app/entities/compra/service/compra.service';
import { IButaca } from 'app/entities/butaca/butaca.model';
import { ButacaService } from 'app/entities/butaca/service/butaca.service';

import { AforoUpdateComponent } from './aforo-update.component';

describe('Aforo Management Update Component', () => {
  let comp: AforoUpdateComponent;
  let fixture: ComponentFixture<AforoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let aforoService: AforoService;
  let proyeccionService: ProyeccionService;
  let compraService: CompraService;
  let butacaService: ButacaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AforoUpdateComponent],
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
      .overrideTemplate(AforoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AforoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    aforoService = TestBed.inject(AforoService);
    proyeccionService = TestBed.inject(ProyeccionService);
    compraService = TestBed.inject(CompraService);
    butacaService = TestBed.inject(ButacaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Proyeccion query and add missing value', () => {
      const aforo: IAforo = { id: 456 };
      const proyeccion: IProyeccion = { id: 19575 };
      aforo.proyeccion = proyeccion;

      const proyeccionCollection: IProyeccion[] = [{ id: 86720 }];
      jest.spyOn(proyeccionService, 'query').mockReturnValue(of(new HttpResponse({ body: proyeccionCollection })));
      const additionalProyeccions = [proyeccion];
      const expectedCollection: IProyeccion[] = [...additionalProyeccions, ...proyeccionCollection];
      jest.spyOn(proyeccionService, 'addProyeccionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ aforo });
      comp.ngOnInit();

      expect(proyeccionService.query).toHaveBeenCalled();
      expect(proyeccionService.addProyeccionToCollectionIfMissing).toHaveBeenCalledWith(proyeccionCollection, ...additionalProyeccions);
      expect(comp.proyeccionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Compra query and add missing value', () => {
      const aforo: IAforo = { id: 456 };
      const compra: ICompra = { id: 66434 };
      aforo.compra = compra;

      const compraCollection: ICompra[] = [{ id: 41857 }];
      jest.spyOn(compraService, 'query').mockReturnValue(of(new HttpResponse({ body: compraCollection })));
      const additionalCompras = [compra];
      const expectedCollection: ICompra[] = [...additionalCompras, ...compraCollection];
      jest.spyOn(compraService, 'addCompraToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ aforo });
      comp.ngOnInit();

      expect(compraService.query).toHaveBeenCalled();
      expect(compraService.addCompraToCollectionIfMissing).toHaveBeenCalledWith(compraCollection, ...additionalCompras);
      expect(comp.comprasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Butaca query and add missing value', () => {
      const aforo: IAforo = { id: 456 };
      const butaca: IButaca = { id: 82307 };
      aforo.butaca = butaca;

      const butacaCollection: IButaca[] = [{ id: 34343 }];
      jest.spyOn(butacaService, 'query').mockReturnValue(of(new HttpResponse({ body: butacaCollection })));
      const additionalButacas = [butaca];
      const expectedCollection: IButaca[] = [...additionalButacas, ...butacaCollection];
      jest.spyOn(butacaService, 'addButacaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ aforo });
      comp.ngOnInit();

      expect(butacaService.query).toHaveBeenCalled();
      expect(butacaService.addButacaToCollectionIfMissing).toHaveBeenCalledWith(butacaCollection, ...additionalButacas);
      expect(comp.butacasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const aforo: IAforo = { id: 456 };
      const proyeccion: IProyeccion = { id: 15139 };
      aforo.proyeccion = proyeccion;
      const compra: ICompra = { id: 50929 };
      aforo.compra = compra;
      const butaca: IButaca = { id: 77143 };
      aforo.butaca = butaca;

      activatedRoute.data = of({ aforo });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(aforo));
      expect(comp.proyeccionsSharedCollection).toContain(proyeccion);
      expect(comp.comprasSharedCollection).toContain(compra);
      expect(comp.butacasSharedCollection).toContain(butaca);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Aforo>>();
      const aforo = { id: 123 };
      jest.spyOn(aforoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ aforo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: aforo }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(aforoService.update).toHaveBeenCalledWith(aforo);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Aforo>>();
      const aforo = new Aforo();
      jest.spyOn(aforoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ aforo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: aforo }));
      saveSubject.complete();

      // THEN
      expect(aforoService.create).toHaveBeenCalledWith(aforo);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Aforo>>();
      const aforo = { id: 123 };
      jest.spyOn(aforoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ aforo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(aforoService.update).toHaveBeenCalledWith(aforo);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackProyeccionById', () => {
      it('Should return tracked Proyeccion primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProyeccionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackCompraById', () => {
      it('Should return tracked Compra primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCompraById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackButacaById', () => {
      it('Should return tracked Butaca primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackButacaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
