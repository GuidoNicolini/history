import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {CubeAction} from '../models/Cube/button-cube';
import {SaveLoadService} from '../../../shared/services/save-load-service';


@Injectable({
  providedIn: 'root',
})
export class CubeActionService {

  constructor(private router: Router, private saveLoadService: SaveLoadService) {}

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
    }
  }
}
