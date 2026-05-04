import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NpcStats } from './views/npc-stats/npc-stats';

@NgModule({
  declarations: [
    NpcStats
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NpcStats
  ]
})
export class NpcModule { }
