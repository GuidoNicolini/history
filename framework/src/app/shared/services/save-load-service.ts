import { Injectable } from '@angular/core';
import {ConditionService} from '../../features/condition/services/condition-service';
import {EventoService} from '../../features/evento';
import {EventoEffectService} from '../../features/evento/services/evento-effect-service';
import {HeroService} from '../../features/hero';
import {LocationService} from '../../features/location';
import { NpcService } from "../../features/npc";
import { TimeService } from "../../features/time";
import {StoryState} from './story-state';

@Injectable({
  providedIn: 'root',
})
export class SaveLoadService {

  constructor(
    private conditionService: ConditionService,
    private eventoService: EventoService,
    private eventoEffectService: EventoEffectService,
    private heroService: HeroService,
    private locationService: LocationService,
    private npcService: NpcService,
    private timeService: TimeService,
    private storyState: StoryState
  ) {}

  private gatherState(): any {
    return {
      hero: this.heroService.exportState(),
      time: this.timeService.exportState(),
      story: this.storyState.exportState(),
      conditions: this.conditionService.exportState(),
       eventos: this.eventoService.exportState(),
      eventoEffects: this.eventoEffectService.exportState(),
      locations: this.locationService.exportState(),
       npcs: this.npcService.exportState(),
    };
  }

  private importState(state: any): void {
    this.heroService.importState(state.hero);
    this.timeService.importState(state.time);
    this.storyState.importState(state.story);
    this.conditionService.importState(state.conditions);
     this.eventoService.importState(state.eventos);
    this.eventoEffectService.importState(state.eventoEffects);
    this.locationService.importState(state.locations);
   this.npcService.importState(state.npcs);
  }

  // --- Local Storage ---

  public saveStateToLocalStorage(): void {
    try {
      const gameState = this.gatherState();
      const jsonState = JSON.stringify(gameState, null, 2);
      localStorage.setItem('savegame', jsonState);
      console.log('Game state saved to local storage.');
    } catch (error) {
      console.error('Error saving game state to local storage:', error);
    }
  }

  public loadStateFromLocalStorage(): void {
    try {
      const jsonState = localStorage.getItem('savegame');
      if (jsonState) {
        const gameState = JSON.parse(jsonState);
        this.importState(gameState);
        console.log('Game state loaded from local storage.');
      } else {
        console.log('No savegame found in local storage.');
      }
    } catch (error) {
      console.error('Error loading game state from local storage:', error);
    }
  }

  // --- File System ---

  public saveStateToFile(): void {
    try {
      const gameState = this.gatherState();
      const jsonState = JSON.stringify(gameState, null, 2);
      const blob = new Blob([jsonState], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'savegame.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
      console.log('Game state saved to file.');
    } catch (error) {
      console.error('Error saving game state to file:', error);
    }
  }

  public loadStateFromFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonState = event.target?.result as string;
        if (jsonState) {
          const gameState = JSON.parse(jsonState);
          this.importState(gameState);
          console.log('Game state loaded from file.');
        }
      } catch (error) {
        console.error('Error loading game state from file:', error);
      }
    };
    reader.readAsText(file);
  }
}
