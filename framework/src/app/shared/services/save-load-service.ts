import { Injectable } from '@angular/core';
import { ISaveable } from '../interfaces/saveable.interface';

@Injectable({
  providedIn: 'root',
})
export class SaveLoadService {

  private subscribers: Map<string, ISaveable> = new Map();

  constructor() {}

  public register(service: ISaveable): void {
    this.subscribers.set(service.saveKey, service);
  }

  private gatherState(): any {
    const state: any = {};
    this.subscribers.forEach((service, key) => {
      state[key] = service.exportState();
    });
    return state;
  }

  private importState(state: any): void {
    this.subscribers.forEach((service, key) => {
      if (state[key] !== undefined) {
        service.importState(state[key]);
      }
    });
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

  public loadStateFromFile(file: File): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonState = event.target?.result as string;
          if (jsonState) {
            const gameState = JSON.parse(jsonState);
            this.importState(gameState);
            console.log('Game state loaded from file.');
            resolve();
          } else {
            reject(new Error('Empty game state file.'));
          }
        } catch (error) {
          console.error('Error loading game state from file:', error);
          reject(error);
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsText(file);
    });
  }
}
