import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventoView } from './views/evento-view/evento-view';
import { ButtonView } from './views/button-view/button-view';
import { ImageView } from './views/image-view/image-view';
import { TextView } from './views/text-view/text-view';
import { VideoView } from './views/video-view/video-view';
import { CodeView } from './views/code-view/code-view';
import { FormView } from './views/form-view/form-view';
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    EventoView,
    ButtonView,
    ImageView,
    TextView,
    VideoView,
    CodeView,
    FormView
  ],
    imports: [
        CommonModule,
        FormsModule
    ]
})
export class EventoModule { }
