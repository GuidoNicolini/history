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

  public getVipStatus(level: number): boolean {
    const vip = this.vips.find(v => v.level === level);
    return vip ? vip.value : false;
  }

}

export interface vip{
  level: number
  value : boolean
}
