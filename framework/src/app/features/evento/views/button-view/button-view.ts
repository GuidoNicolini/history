import {Component, Input} from '@angular/core';
import {ButtonCube} from '../../models/Cube/button-cube';
import {CubeActionService} from '../../services/cube-action-service';
import {ConditionEvaluator} from '../../../../shared/services/condition-evaluator';

@Component({
  selector: 'app-button-view',
  standalone: false,
  templateUrl: './button-view.html',
  styleUrl: './button-view.css',
})
export class ButtonView {

  @Input() cube!: ButtonCube;

  constructor(
    private cubeActionService: CubeActionService,
    private conditionEvaluator: ConditionEvaluator
  ) {}

  get isDisabled(): boolean {
    return !this.conditionEvaluator.checkAll(this.cube.conditions);
  }

  protected action() {
    this.cubeActionService.applyAction(this.cube.cubeAction);
  }

}
