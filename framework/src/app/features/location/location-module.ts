import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationView } from './views/location-view/location-view';
import { Card } from './views/card/card';




@NgModule({
  declarations: [
    LocationView,
    Card,

  ],
  imports: [
    CommonModule
  ]
})
export class LocationModule { }
