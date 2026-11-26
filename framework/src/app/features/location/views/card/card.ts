import {Component, Input, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Location} from '../../models/location';
import {Router} from '@angular/router';


@Component({
  selector: 'app-card',
  standalone: false,
  templateUrl: './card.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './card.css',
})
export class Card implements OnInit {

  @Input() location!: Location;
  thumbnail : string = ""

  get styleClasses(): string[] {
    return Array.isArray(this.location?.styleClass) ? this.location.styleClass : [];
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.location?.images) {
      const thumb = this.location.images.find(img => img.type === 'thumbnail');
      if (thumb) {
        this.thumbnail = thumb.url;
      }
    }

  }

  goTo() {

    if (this.location?.url) {
      this.router.navigate([this.location.url]);
    }

  }
}
