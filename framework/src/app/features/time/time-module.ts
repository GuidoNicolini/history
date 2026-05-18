import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Clock } from './views/clock/clock';



@NgModule({
    declarations: [
        Clock
    ],
    exports: [
        Clock
    ],
    imports: [
        CommonModule
    ]
})
export class TimeModule { }
