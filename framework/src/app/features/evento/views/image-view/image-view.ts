import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {ImageCube} from '../../models/Cube/image-cube';

@Component({
  selector: 'app-image-view',
  standalone: false,
  templateUrl: './image-view.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './image-view.css',
})
export class ImageView {
  @Input() cube!: ImageCube;

}
