import {Injectable, signal} from '@angular/core';
import {Time} from '../models/time';
import {Day} from '../../../shared/enums/day';

@Injectable({
  providedIn: 'root',
})
export class TimeService {

  public state = signal<Time>({} as Time);

  public initializeTime(timeData: Time): void {
    this.state.set(timeData);
  }

  /**
   * Avanza la cantidad de minutos especificada.
   * Si los minutos superan 59, se calculan las horas extras y se avanza la hora.
   */
  public advanceMinutes(minutes: number): void {
    const current = this.state();
    const totalMinutes = current.minutes + minutes;

    const newMinutes = totalMinutes % 60;
    const extraHours = Math.floor(totalMinutes / 60);

    this.state.update(s => ({ ...s, minutes: newMinutes }));

    if (extraHours > 0) {
      this.advanceHours(extraHours);
    }
  }

  /**
   * Avanza la cantidad de horas especificada.
   * Por cada hora avanzada de forma individual se ejecuta la lógica del cambio de hora,
   * permitiendo reaccionar a cada cambio (ej: movimiento de NPCs hora por hora).
   */
  public advanceHours(hours: number): void {
    for (let i = 0; i < hours; i++) {
      const current = this.state();
      const newHour = current.hour + 1;

      if (newHour >= 24) {
        this.state.update(s => ({ ...s, hour: 0 }));
        this.onHourChanged();
        this.advanceDay();
      } else {
        this.state.update(s => ({ ...s, hour: newHour }));
        this.onHourChanged();
      }
    }
  }

  /**
   * Avanza un día completo, actualizando el número del día (date) y el día de la semana.
   */
  public advanceDay(): void {
    const current = this.state();
    const newDate = current.date + 1;
    // Vuelve al Lunes si el día actual es Domingo, sino suma 1.
    const newDay = current.day === Day.SUNDAY ? Day.MONDAY : current.day + 1;

    this.state.update(s => ({
      ...s,
      date: newDate,
      day: newDay as Day
    }));

    this.onDayChanged();
  }

  /**
   * Se ejecuta por cada cambio de hora en el sistema.
   */
  private onHourChanged(): void {
    // TODO: Lógica en cada cambio de hora
    // Por ejemplo: Los NPCs cambian su ubicación, se actualiza el clima, etc.
  }

  /**
   * Se ejecuta por cada cambio de día en el sistema.
   */
  private onDayChanged(): void {
    // TODO: Lógica en cada cambio de día
    // Por ejemplo: Reiniciar eventos diarios, regenerar recursos, etc.
  }

  public exportState(): Time {
    return this.state();
  }

  public importState(newState: Time): void {
    this.state.set(newState);
  }

}
