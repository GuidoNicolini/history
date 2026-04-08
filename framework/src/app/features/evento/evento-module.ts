import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventoView } from './views/evento-view/evento-view';
import { ButtonView } from './views/button-view/button-view';
import { ImageView } from './views/image-view/image-view';
import { TextView } from './views/text-view/text-view';
import { VideoView } from './views/video-view/video-view';



@NgModule({
  declarations: [
    EventoView,
    ButtonView,
    ImageView,
    TextView,
    VideoView
  ],
  imports: [
    CommonModule
  ]
})
export class EventoModule { }
