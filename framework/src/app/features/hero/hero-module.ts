import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroStats } from './views/hero-stats/hero-stats';
import { HeroInventory } from './views/hero-inventory/hero-inventory';



@NgModule({
  declarations: [
    HeroStats,
    HeroInventory
  ],
  exports: [
    HeroStats,
    HeroInventory
  ],
  imports: [
    CommonModule
  ]
})
export class HeroModule { }
