import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VipService {

  public vipChanges$ = new BehaviorSubject<void>(undefined);

  vips: vip[] = [
    { level: 1, value: false },
    { level: 2, value: false },
    { level: 3, value: false },
    { level: 4, value: false },
    { level: 5, value: false },
  ];

  private clave1Hash: number = -1065125741;
  private clave2Hash: number = -1381059737;
  private clave3Hash: number = 1549538167;
  private clave4Hash: number = -536430001;
  private clave5Hash: number = -1600010989;


  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return hash;
  }
  public getVipStatus(level: number): boolean {
    const vip = this.vips.find(v => v.level === level);
    return vip ? vip.value : false;
  }


  public codePatreon(code:string){

    let counter:number = 0;

    const salt = 'code';
    const codeHash = this.hashString(code + salt);

    if(codeHash == this.clave1Hash){
      for (let i = 1; i < 2; i++) {
        this.updateVip(i)
      }
      counter++
      alert("Code redeemed successfully.")
    }

    if(codeHash == this.clave2Hash){
      for (let i = 1; i < 3; i++) {
        this.updateVip(i)
      }
      counter++
      alert("Code redeemed successfully.")
    }

    if(codeHash == this.clave3Hash){
      for (let i = 1; i < 4; i++) {
        this.updateVip(i)
      }
      counter++
      alert("Code redeemed successfully.")
    }

    if(codeHash == this.clave4Hash){
      for (let i = 1; i < 5; i++) {
        this.updateVip(i)
      }
      counter++
      alert("Code redeemed successfully.")
    }

    if(codeHash == this.clave5Hash){
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
