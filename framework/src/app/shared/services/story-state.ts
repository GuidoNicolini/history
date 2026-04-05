import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StoryState {
  // Aquí guardamos TOD0 el progreso de la historia
  public flags = signal<Record<string, any>>({
    'juego_iniciado': true,
    'capitulo_actual': 1,
  });

  setFlag(key: string, value: any) {
    this.flags.update(f => ({ ...f, [key]: value }));
  }

  getFlag(key: string): any {
    return this.flags()[key];
  }
}
