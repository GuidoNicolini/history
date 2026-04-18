import { Injectable, signal } from '@angular/core';
import { ISaveable } from '../interfaces/saveable.interface';
import { SaveLoadService } from './save-load-service';

@Injectable({
  providedIn: 'root',
})
export class UserConfigService implements ISaveable {
  public saveKey = 'userConfig';

  constructor(private saveLoadService: SaveLoadService) {
    this.saveLoadService.register(this);
  }

  public names = signal<Record<string, string>>({
    'momName': 'Landlady',
    'dadName': 'Landlord',
    'youngSister': 'Roommate',
    'olderSister': 'Roommate',
    'brother': 'Roommate'
  });

  public setName(key: string, value: string) {
    this.names.update(n => ({ ...n, [key]: value }));
  }

  public getMomName(): string {
    return this.names()['momName'];
  }

  public getDadName(): string {
    return this.names()['dadName'];
  }

  public getYoungSisterName(): string {
    return this.names()['youngSister'];
  }

  public getOlderSisterName(): string {
    return this.names()['olderSister'];
  }

  public getBrotherName(): string {
    return this.names()['brother'];
  }

  public exportState(): Record<string, string> {
    return this.names();
  }

  public importState(state: Record<string, string>): void {
    if (state) {
      this.names.set(state);
    }
  }

}
