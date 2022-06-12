import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAforo, Aforo } from '../aforo.model';

import { AforoService } from './aforo.service';

describe('Aforo Service', () => {
  let service: AforoService;
  let httpMock: HttpTestingController;
  let elemDefault: IAforo;
  let expectedResult: IAforo | IAforo[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AforoService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      reservada: false,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Aforo', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Aforo()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Aforo', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          reservada: true,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Aforo', () => {
      const patchObject = Object.assign({}, new Aforo());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Aforo', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          reservada: true,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Aforo', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAforoToCollectionIfMissing', () => {
      it('should add a Aforo to an empty array', () => {
        const aforo: IAforo = { id: 123 };
        expectedResult = service.addAforoToCollectionIfMissing([], aforo);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(aforo);
      });

      it('should not add a Aforo to an array that contains it', () => {
        const aforo: IAforo = { id: 123 };
        const aforoCollection: IAforo[] = [
          {
            ...aforo,
          },
          { id: 456 },
        ];
        expectedResult = service.addAforoToCollectionIfMissing(aforoCollection, aforo);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Aforo to an array that doesn't contain it", () => {
        const aforo: IAforo = { id: 123 };
        const aforoCollection: IAforo[] = [{ id: 456 }];
        expectedResult = service.addAforoToCollectionIfMissing(aforoCollection, aforo);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(aforo);
      });

      it('should add only unique Aforo to an array', () => {
        const aforoArray: IAforo[] = [{ id: 123 }, { id: 456 }, { id: 70563 }];
        const aforoCollection: IAforo[] = [{ id: 123 }];
        expectedResult = service.addAforoToCollectionIfMissing(aforoCollection, ...aforoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const aforo: IAforo = { id: 123 };
        const aforo2: IAforo = { id: 456 };
        expectedResult = service.addAforoToCollectionIfMissing([], aforo, aforo2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(aforo);
        expect(expectedResult).toContain(aforo2);
      });

      it('should accept null and undefined values', () => {
        const aforo: IAforo = { id: 123 };
        expectedResult = service.addAforoToCollectionIfMissing([], null, aforo, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(aforo);
      });

      it('should return initial array if no Aforo is added', () => {
        const aforoCollection: IAforo[] = [{ id: 123 }];
        expectedResult = service.addAforoToCollectionIfMissing(aforoCollection, undefined, null);
        expect(expectedResult).toEqual(aforoCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
