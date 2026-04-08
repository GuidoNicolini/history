import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LocationView} from './features/location/views/location-view/location-view';
import {EventoView} from './features/evento/views/evento-view/evento-view';

const routes: Routes = [
  {path: 'location/:id', component: LocationView},
  {path: 'evento/:id', component: EventoView},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
