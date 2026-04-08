import {Component, Input} from '@angular/core';
import {VideoCube} from '../../models/Cube/video-cube';

@Component({
  selector: 'app-video-view',
  standalone: false,
  templateUrl: './video-view.html',
  styleUrl: './video-view.css',
})
export class VideoView {
  @Input() cube!: VideoCube;

}
