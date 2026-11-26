import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {VideoCube} from '../../models/Cube/video-cube';

@Component({
  selector: 'app-video-view',
  standalone: false,
  templateUrl: './video-view.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './video-view.css',
})
export class VideoView {
  @Input() cube!: VideoCube;

}
