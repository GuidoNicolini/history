import {Component, Input} from '@angular/core';
import {ButtonCube} from '../../models/Cube/button-cube';
import {CubeActionService} from '../../services/cube-action-service';
import {ConditionEvaluator} from '../../../condition/services/condition-evaluator';
import {ConditionService} from '../../../condition/services/condition-service';

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
    private conditionEvaluator: ConditionEvaluator,
    private conditionService: ConditionService
  ) {}

  get isDisabled(): boolean {
    if (!this.cube.conditions || this.cube.conditions.length === 0) return false;
    const conditions = this.conditionService.findConditions(this.cube.conditions);
    return !this.conditionEvaluator.checkAll(conditions);
  }

  get buttonClasses(): string[] {
    const defaultClasses = ['btn', 'btn-lg', 'btn-primary'];
    if (this.cube && this.cube.styleClass && Array.isArray(this.cube.styleClass)) {
      return [...defaultClasses, ...this.cube.styleClass];
    }
    return defaultClasses;
  }

  protected action() {
    this.cubeActionService.applyAction(this.cube.cubeAction);
  }

}
