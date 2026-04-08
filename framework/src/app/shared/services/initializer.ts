import {HttpClient} from '@angular/common/http';
import {HeroService, HeroState} from '../../features/hero';
import {inject} from '@angular/core';

export class Initializer {

  private http = inject(HttpClient);
  private heroService = inject(HeroService);

  hero() {
    this.http.get<HeroState>('data/hero/hero.json').subscribe(heroData => {
      this.heroService.initializeHero(heroData);
    });
  }
}
