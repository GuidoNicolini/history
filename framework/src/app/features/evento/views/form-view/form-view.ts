import {Component, Input, OnInit} from '@angular/core';
import {FormCube} from '../../models/Cube/form-cube';
import {UserConfigService} from '../../../../shared/services/user-config-service';
import {VipService} from '../../../../shared/services/vip-service';

@Component({
  selector: 'app-form-view',
  standalone: false,
  templateUrl: './form-view.html',
  styleUrl: './form-view.css',
})
export class FormView implements OnInit{

  @Input() cube!: FormCube;
  placeHolder !: string
  text !: string

  constructor(private userConfigService: UserConfigService, private vipService:VipService) {}

  //TODO: Hacer esta logica para que se llame a la funcion correspondiente

  ngOnInit(): void {
    this.placeHolder = this.cube.placeHolder

  }

  protected fun() {

    if(this.cube.fuctionName === 'npc-name'){
      const key = this.cube.parameters[0];
      if (key && this.text) {
        this.userConfigService.setName(key, this.text);
        alert("Changes saved")
      }
    }

    if(this.cube.fuctionName === 'vip'){
      this.vipService.codePatreon(this.text)
    }


  }



}
