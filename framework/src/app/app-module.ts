import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import {HeroModule} from "./features/hero";
import {NpcModule} from './features/npc/npc-module';
import {TimeModule} from './features/time/time-module';
import {EventoModule} from './features/evento';
import {LocationModule} from './features/location';
import { StartView } from './shared/views/start-view/start-view';
import { DebugStart } from './shared/views/debug-start/debug-start';

@NgModule({
  declarations: [
    App,
    StartView,
    DebugStart
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HeroModule,
    NpcModule,
    TimeModule,
    EventoModule,
    LocationModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
