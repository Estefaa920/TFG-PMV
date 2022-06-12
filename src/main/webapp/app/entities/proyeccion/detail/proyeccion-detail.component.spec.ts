import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProyeccionDetailComponent } from './proyeccion-detail.component';

describe('Proyeccion Management Detail Component', () => {
  let comp: ProyeccionDetailComponent;
  let fixture: ComponentFixture<ProyeccionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProyeccionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ proyeccion: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ProyeccionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ProyeccionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load proyeccion on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.proyeccion).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
