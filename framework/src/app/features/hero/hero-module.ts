import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroStats } from './views/hero-stats/hero-stats';
import { HeroInventory } from './views/hero-inventory/hero-inventory';
import { HeroEnergy } from './views/hero-energy/hero-energy';
import { HeroMoney } from './views/hero-money/hero-money';



@NgModule({
  declarations: [
    HeroStats,
    HeroInventory,
    HeroEnergy,
    HeroMoney
  ],
  exports: [
    HeroStats,
    HeroInventory,
    HeroEnergy,
    HeroMoney
  ],
  imports: [
    CommonModule
  ]
})
export class HeroModule { }
