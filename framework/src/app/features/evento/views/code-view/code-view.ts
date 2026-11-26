import {Component, Input, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {CodeCube} from '../../models/Cube/code-cube';
import {ConditionService} from '../../../condition/services/condition-service';
import {ConditionEvaluator} from '../../../condition/services/condition-evaluator';
import {Funciones} from './funciones';

@Component({
  selector: 'app-code-view',
  standalone: false,
  templateUrl: './code-view.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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
        case 'redirection':
          this.funciones.redirection(this.cube.parameters[0],this.cube.parameters[1]);
          break;
        case 'cafeJobTrue':
          this.funciones.cafeJobSetTrue()
          break;
        case 'launchEventoById':
          this.funciones.launchEventoById(this.cube.parameters[0])
          break;
        case 'lauchEventoGroup': {
           this.funciones.lauchEventoGroup(this.cube.parameters)
          break;
        }
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
