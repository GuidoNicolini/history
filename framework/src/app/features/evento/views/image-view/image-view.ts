import {Component, Input} from '@angular/core';
import {ImageCube} from '../../models/Cube/image-cube';

@Component({
  selector: 'app-image-view',
  standalone: false,
  templateUrl: './image-view.html',
  styleUrl: './image-view.css',
})
export class ImageView {
  @Input() cube!: ImageCube;

}
