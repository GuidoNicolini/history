import {Component, OnInit, signal} from '@angular/core';
import {Initializer} from './shared/services/initializer';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App{

  protected readonly title = signal('Happy City');

}
