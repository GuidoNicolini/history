import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import {HeroModule} from "./features/hero";

@NgModule({
  declarations: [
    App
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HeroModule
    ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
