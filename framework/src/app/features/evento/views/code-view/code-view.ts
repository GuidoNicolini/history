import {Component, Input, OnInit} from '@angular/core';
import {CodeCube} from '../../models/Cube/code-cube';
import {ConditionService} from '../../../condition/services/condition-service';
import {ConditionEvaluator} from '../../../condition/services/condition-evaluator';
import {Funciones} from './funciones';

@Component({
  selector: 'app-code-view',
  standalone: false,
  templateUrl: './code-view.html',
  styleUrl: './code-view.css',
})
export class CodeView implements OnInit {

  @Input() cube!: CodeCube;

  funciones = new Funciones()

  constructor(
    private conditionService: ConditionService,
    private conditionEvaluator: ConditionEvaluator
  ) {}

  ngOnInit(): void {

    if(this.checkConditions(this.cube.conditions)){

      switch (this.cube.functionName) {
        case 'meetMomSetTrue':
          this.funciones.meetMomSetTrue();
          break;
        case 'meetLilSisSetTrue':
         this.funciones.meetLilSisSetTrue();
          break;
          case 'meetOldSisSetTrue':
          this.funciones.meetOldSisSetTrue();
          break;
        case 'meetDad':
          this.funciones.meetDadSetTrue();
          break;
        case 'meetFamilyTrue':
          this.funciones.meetFamilyTrue();
        break;

      }


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
