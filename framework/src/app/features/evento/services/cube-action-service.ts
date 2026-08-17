import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {CubeAction} from '../models/Cube/button-cube';
import {SaveLoadService} from '../../../shared/services/save-load-service';
import {HeroService} from '../../hero/services/hero-service';
import {GameItems} from '../../../shared/enums/game-items';
import {EventoService} from './evento-service';
import { StoryState } from '../../../shared/services/story-state';

@Injectable({
  providedIn: 'root',
})
export class CubeActionService {

  constructor(private router: Router, private saveLoadService: SaveLoadService, private heroService: HeroService, private eventoService : EventoService, private storyState: StoryState) { }

  public applyAll(actions: CubeAction[]): void {
    if (!actions || actions.length === 0) return;
    for (const action of actions) {
      this.applyAction(action);
    }
  }

  public applyAction(action: CubeAction): void {
    switch (action.type) {
      case 'redirection': {
        this.router.navigate([action.value]);
        break;
      }
      case 'save': {
        this.saveLoadService.saveStateToFile();
        this.router.navigate([action.value]);
        break;
      }
      case 'buy': {
        if (typeof action.value === 'string' && action.value.includes(':')) {
          const [itemString, costString] = action.value.split(':');
          const item = itemString as GameItems;
          const cost = parseInt(costString, 10);

          if (!isNaN(cost) && Object.values(GameItems).includes(item)) {
             this.heroService.removeItem(GameItems.MONEY, cost);
             this.heroService.addItem(item, 1);
          }
        }
        break;
      }
      case 'launchevento' : {
        this.eventoService.launchEventoById(action.value);
        break;
      }
      case 'flag': {
        if (typeof action.value === 'string' && action.value.includes(':')) {
          const [flagName, amountString] = action.value.split(':');
          const amount = parseInt(amountString, 10);

          if (!isNaN(amount)) {
            const currentValue = Number(this.storyState.getFlag(flagName)) || 0;
            this.storyState.setFlag(flagName, currentValue + amount);
            this.heroService.removeItem(GameItems.MONEY, amount);
          }
        }
        break;
      }
    }
  }
}
