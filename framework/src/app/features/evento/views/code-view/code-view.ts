import {Component, Input, OnInit} from '@angular/core';
import {CodeCube} from '../../models/Cube/code-cube';
import {ConditionService} from '../../../condition/services/condition-service';
import {ConditionEvaluator} from '../../../condition/services/condition-evaluator';

@Component({
  selector: 'app-code-view',
  standalone: false,
  templateUrl: './code-view.html',
  styleUrl: './code-view.css',
})
export class CodeView implements OnInit {

  @Input() cube!: CodeCube;

  constructor(
    private conditionService: ConditionService,
    private conditionEvaluator: ConditionEvaluator
  ) {}

  ngOnInit(): void {

    if(this.checkConditions(this.cube.conditions)){

      // Debajo de aqui iran los metodos que se llamaran utilizando el nombre
      // crear una clase donde esten todos los metodos para no sobrecargar esta y hacerla mas mantenible

    }

  }

  checkConditions(conditions: number[]): boolean {
    if (!conditions || conditions.length === 0) {
      return true;
    }
    const gameConditions = this.conditionService.findConditions(conditions);
    return this.conditionEvaluator.checkAll(gameConditions);
  }

}
