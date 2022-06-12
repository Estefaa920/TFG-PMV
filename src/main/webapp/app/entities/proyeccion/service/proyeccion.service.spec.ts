import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IProyeccion, Proyeccion } from '../proyeccion.model';

import { ProyeccionService } from './proyeccion.service';

describe('Proyeccion Service', () => {
  let service: ProyeccionService;
  let httpMock: HttpTestingController;
  let elemDefault: IProyeccion;
  let expectedResult: IProyeccion | IProyeccion[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProyeccionService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      fecha: currentDate,
      precio: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          fecha: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Proyeccion', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          fecha: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fecha: currentDate,
        },
        returnedFromService
      );

      service.create(new Proyeccion()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Proyeccion', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fecha: currentDate.format(DATE_TIME_FORMAT),
          precio: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fecha: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Proyeccion', () => {
      const patchObject = Object.assign({}, new Proyeccion());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          fecha: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Proyeccion', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fecha: currentDate.format(DATE_TIME_FORMAT),
          precio: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fecha: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Proyeccion', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addProyeccionToCollectionIfMissing', () => {
      it('should add a Proyeccion to an empty array', () => {
        const proyeccion: IProyeccion = { id: 123 };
        expectedResult = service.addProyeccionToCollectionIfMissing([], proyeccion);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(proyeccion);
      });

      it('should not add a Proyeccion to an array that contains it', () => {
        const proyeccion: IProyeccion = { id: 123 };
        const proyeccionCollection: IProyeccion[] = [
          {
            ...proyeccion,
          },
          { id: 456 },
        ];
        expectedResult = service.addProyeccionToCollectionIfMissing(proyeccionCollection, proyeccion);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Proyeccion to an array that doesn't contain it", () => {
        const proyeccion: IProyeccion = { id: 123 };
        const proyeccionCollection: IProyeccion[] = [{ id: 456 }];
        expectedResult = service.addProyeccionToCollectionIfMissing(proyeccionCollection, proyeccion);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(proyeccion);
      });

      it('should add only unique Proyeccion to an array', () => {
        const proyeccionArray: IProyeccion[] = [{ id: 123 }, { id: 456 }, { id: 20286 }];
        const proyeccionCollection: IProyeccion[] = [{ id: 123 }];
        expectedResult = service.addProyeccionToCollectionIfMissing(proyeccionCollection, ...proyeccionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const proyeccion: IProyeccion = { id: 123 };
        const proyeccion2: IProyeccion = { id: 456 };
        expectedResult = service.addProyeccionToCollectionIfMissing([], proyeccion, proyeccion2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(proyeccion);
        expect(expectedResult).toContain(proyeccion2);
      });

      it('should accept null and undefined values', () => {
        const proyeccion: IProyeccion = { id: 123 };
        expectedResult = service.addProyeccionToCollectionIfMissing([], null, proyeccion, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(proyeccion);
      });

      it('should return initial array if no Proyeccion is added', () => {
        const proyeccionCollection: IProyeccion[] = [{ id: 123 }];
        expectedResult = service.addProyeccionToCollectionIfMissing(proyeccionCollection, undefined, null);
        expect(expectedResult).toEqual(proyeccionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
