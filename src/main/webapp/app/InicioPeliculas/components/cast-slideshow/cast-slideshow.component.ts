import { Component, Input } from '@angular/core';
import { Cast } from 'app/InicioPeliculas/interfaces/credit-response';
import Swiper from 'swiper';

@Component({
  selector: 'jhi-cast-slideshow',
  templateUrl: './cast-slideshow.component.html',
  styleUrls: ['./cast-slideshow.component.css'],
})
export class CastSlideShowComponent {
  @Input()
  cast?: Cast[];

  ngAfterViewInit(): void {
    const swiper = new Swiper('.swiper-container', {
      slidesPerView: 5.3,
      freeMode: true,
      spaceBetween: 15,
    });
  }
}
