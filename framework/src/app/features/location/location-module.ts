import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationView } from './views/location-view/location-view';
import { Card } from './views/card/card';
import { ExitCard } from './views/exit-card/exit-card';




@NgModule({
  declarations: [
    LocationView,
    Card,
    ExitCard,

  ],
  imports: [
    CommonModule
  ]
})
export class LocationModule { }
