import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AforoDetailComponent } from './aforo-detail.component';

describe('Aforo Management Detail Component', () => {
  let comp: AforoDetailComponent;
  let fixture: ComponentFixture<AforoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AforoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ aforo: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AforoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AforoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load aforo on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.aforo).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
