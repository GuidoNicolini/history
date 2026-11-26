import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-title',
  standalone: false,
  templateUrl: './title.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './title.css',
})
export class Title {

}
