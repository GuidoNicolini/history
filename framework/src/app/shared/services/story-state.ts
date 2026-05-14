import {Injectable, signal} from '@angular/core';
import { ISaveable } from '../interfaces/saveable.interface';
import { SaveLoadService } from './save-load-service';

@Injectable({
  providedIn: 'root',
})
export class StoryState implements ISaveable {
  public saveKey = 'story';

  constructor(private saveLoadService: SaveLoadService) {
    this.saveLoadService.register(this);
  }

  // Aquí guardamos TOD0 el progreso de la historia
  public flags = signal<Record<string, any>>({
    'meet_mom': false,
    'meet_lil_sis' :false,
    'meet_old_sis' : false,
    'meet_dad' : false,
    'meet_family' : false,

  });

  setFlag(key: string, value: any) {
    this.flags.update(f => ({ ...f, [key]: value }));
  }

  getFlag(key: string): any {
    return this.flags()[key];
  }

  /**
   * Exporta el estado actual de la historia.
   * @returns El estado actual.
   */
  public exportState(): Record<string, any> {
    return this.flags();
  }

  /**
   * Importa y establece un estado para la historia.
   * @param state El estado a importar.
   */
  public importState(state: Record<string, any>): void {
    this.flags.set(state);
  }

}
