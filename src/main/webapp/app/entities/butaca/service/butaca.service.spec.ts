import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IButaca, Butaca } from '../butaca.model';

import { ButacaService } from './butaca.service';

describe('Butaca Service', () => {
  let service: ButacaService;
  let httpMock: HttpTestingController;
  let elemDefault: IButaca;
  let expectedResult: IButaca | IButaca[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ButacaService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      posicion: 'AAAAAAA',
      premium: false,
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

    it('should create a Butaca', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Butaca()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Butaca', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          posicion: 'BBBBBB',
          premium: true,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Butaca', () => {
      const patchObject = Object.assign(
        {
          posicion: 'BBBBBB',
          premium: true,
        },
        new Butaca()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Butaca', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          posicion: 'BBBBBB',
          premium: true,
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

    it('should delete a Butaca', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addButacaToCollectionIfMissing', () => {
      it('should add a Butaca to an empty array', () => {
        const butaca: IButaca = { id: 123 };
        expectedResult = service.addButacaToCollectionIfMissing([], butaca);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(butaca);
      });

      it('should not add a Butaca to an array that contains it', () => {
        const butaca: IButaca = { id: 123 };
        const butacaCollection: IButaca[] = [
          {
            ...butaca,
          },
          { id: 456 },
        ];
        expectedResult = service.addButacaToCollectionIfMissing(butacaCollection, butaca);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Butaca to an array that doesn't contain it", () => {
        const butaca: IButaca = { id: 123 };
        const butacaCollection: IButaca[] = [{ id: 456 }];
        expectedResult = service.addButacaToCollectionIfMissing(butacaCollection, butaca);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(butaca);
      });

      it('should add only unique Butaca to an array', () => {
        const butacaArray: IButaca[] = [{ id: 123 }, { id: 456 }, { id: 64791 }];
        const butacaCollection: IButaca[] = [{ id: 123 }];
        expectedResult = service.addButacaToCollectionIfMissing(butacaCollection, ...butacaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const butaca: IButaca = { id: 123 };
        const butaca2: IButaca = { id: 456 };
        expectedResult = service.addButacaToCollectionIfMissing([], butaca, butaca2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(butaca);
        expect(expectedResult).toContain(butaca2);
      });

      it('should accept null and undefined values', () => {
        const butaca: IButaca = { id: 123 };
        expectedResult = service.addButacaToCollectionIfMissing([], null, butaca, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(butaca);
      });

      it('should return initial array if no Butaca is added', () => {
        const butacaCollection: IButaca[] = [{ id: 123 }];
        expectedResult = service.addButacaToCollectionIfMissing(butacaCollection, undefined, null);
        expect(expectedResult).toEqual(butacaCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
