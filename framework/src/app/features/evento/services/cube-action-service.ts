import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CubeAction } from '../models/Cube/cube-action';

@Injectable({
  providedIn: 'root',
})
export class CubeActionService {

  constructor(private router: Router) {}

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
    }
  }
}
