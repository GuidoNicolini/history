import {Component, OnInit, signal, ChangeDetectionStrategy} from '@angular/core';
import {Initializer} from './shared/services/initializer';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css'
})
export class App{

  protected readonly title = signal('Happy City');

}
