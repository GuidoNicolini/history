import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-exit-card',
  standalone: false,
  templateUrl: './exit-card.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './exit-card.css',
})


export class ExitCard {

  @Input() backUrl !: string;

  constructor(private router: Router) {
  }


  goTo() {
    this.router.navigate([this.backUrl]);
  }
}
