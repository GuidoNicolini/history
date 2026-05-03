import {HttpClient} from '@angular/common/http';
import {HeroService, HeroState} from '../../features/hero';
import {inject} from '@angular/core';
import {forkJoin, map, Observable} from 'rxjs';
import {EventoService} from '../../features/evento';
import {EventoState} from '../../features/evento/models/evento-state';
import {LocationService} from '../../features/location';
import {NpcService, NpcState} from '../../features/npc';
import {TimeService} from '../../features/time';
import {ConditionService} from '../../features/condition/services/condition-service';
import {GameCondition} from '../../features/condition/models/game-condition';
import {EventoEffectService} from '../../features/evento/services/evento-effect-service';
import {EventoEffect} from '../../features/evento/models/evento-effect';

export class Initializer {

  private http = inject(HttpClient);
  private heroService = inject(HeroService);
  private eventoService = inject(EventoService)
  private locationService = inject(LocationService);
  private npcService = inject(NpcService);
  private timeService = inject(TimeService);
  private conditionService = inject(ConditionService);
  private eventoEffectsService = inject(EventoEffectService)

  private loadData<T>(entity: string): Observable<T[]> {
    return this.http.get<T[]>(`data/${entity}.json`);
  }

  initializeAllData() {
    forkJoin({
      heroes: this.loadData<HeroState>('heroes'),
      eventos: this.loadData<EventoState>('eventos'),
      locations: this.loadData<any>('locations'),
      npcs: this.loadData<NpcState>('npcs'),
      time: this.loadData<any>('time'),
      gameConditions: this.loadData<GameCondition>('gameConditions'),
      effects: this.loadData<EventoEffect>('eventoEffects')
    }).subscribe(({heroes, eventos, locations, npcs, time, gameConditions, effects}) => {


      if (heroes.length > 0) {
        this.heroService.initializeHero(heroes[0]);
      }
      this.locationService.initilizeLocations(locations)
      this.eventoService.initializeEventos(eventos)
      this.npcService.initializeNpcs(npcs);
      if (time.length > 0) {
        this.timeService.initializeTime(time[0])
      }
      this.conditionService.initializeConditions(gameConditions)
      this.eventoEffectsService.initializeEffects(effects)

      console.log('¡Todos los datos iniciales han sido cargados!');
    });
  }
}
