import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VipService {

  public vipChanges$ = new BehaviorSubject<void>(undefined);

  vips: vip[] = [
    { level: 1, value: true },
    { level: 2, value: true },
    { level: 3, value: true },
    { level: 4, value: true },
    { level: 5, value: true },
  ];

  private clave1: string = 'ftp';
  private clave2: string = 'yszv';
  private clave3: string = 'mvlzi';
  private clave4: string = 'wejx';
  private clave5:string =  'lothfb';

  public getVipStatus(level: number): boolean {
    const vip = this.vips.find(v => v.level === level);
    return vip ? vip.value : false;
  }


  public codePatreon(code:string){

    let counter:number = 0;

    if(code == this.clave1){
      for (let i = 1; i < 2; i++) {
        this.updateVip(i)
      }
      counter++
      alert("Code redeemed successfully.")
    }

    if(code == this.clave2){
      for (let i = 1; i < 3; i++) {
        this.updateVip(i)
      }
      counter++
      alert("Code redeemed successfully.")
    }

    if(code == this.clave3){
      for (let i = 1; i < 4; i++) {
        this.updateVip(i)
      }
      counter++
      alert("Code redeemed successfully.")
    }

    if(code == this.clave4){
      for (let i = 1; i < 5; i++) {
        this.updateVip(i)
      }
      counter++
      alert("Code redeemed successfully.")
    }

    if(code == this.clave5){
      for (let i = 1; i < 6; i++) {
        this.updateVip(i)
      }
      counter++
      alert("Code redeemed successfully.")
    }

    if(counter == 0){
      alert("Sorry, that code is invalid")
    }

    this.logVipStatus()

  }


  private updateVip(level: number):void{

    const vip = this.vips.find(v => v.level === level);
    if (vip) {
      vip.value = true;
      this.vipChanges$.next();
    }

  }

  private logVipStatus(){
    this.vips.forEach(vip => {
      console.log(`Level: ${vip.level}, Status: ${vip.value}`);
    });

  }

}




export interface vip{
  level: number
  value : boolean
}
