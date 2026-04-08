import {Component, Input, OnInit} from '@angular/core';
import {Location} from '../../models/location';
import {Router} from '@angular/router';
import {TypeLocation} from '../../../../shared/enums/type-location';

@Component({
  selector: 'app-card',
  standalone: false,
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card implements OnInit {

  @Input() location!: Location;
  thumbnail : string = ""

  constructor(private router: Router) {
  }

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
