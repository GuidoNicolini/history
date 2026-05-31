import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VipService {

  vips: vip[] = [
    { level: 1, value: false },
    { level: 2, value: false },
    { level: 3, value: false },
    { level: 4, value: false }
  ];

  private clave1: string = 'rstve';
  private clave2: string = 'pemcgt';
  private clave3: string = 'awqvxfr';
  private clave4: string = 'bvcetese';

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

    if(counter == 0){
      alert("Sorry, that code is invalid")
    }

    this.logVipStatus()

  }


  private updateVip(level: number):void{

    const vip = this.vips.find(v => v.level === level);
    if (vip) {
      vip.value = true;
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
