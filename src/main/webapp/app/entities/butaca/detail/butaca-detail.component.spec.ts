import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ButacaDetailComponent } from './butaca-detail.component';

describe('Butaca Management Detail Component', () => {
  let comp: ButacaDetailComponent;
  let fixture: ComponentFixture<ButacaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ButacaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ butaca: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ButacaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ButacaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load butaca on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.butaca).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
