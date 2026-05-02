import { inject } from '@angular/core';
import { StoryState } from '../../../../shared/services/story-state';

export class Funciones {
  private storyState = inject(StoryState);

  meetMomSetTrue() {
    this.storyState.setFlag('meet_mom', true);
  }

  meetLilSisSetTrue() {
    this.storyState.setFlag('meet_lil_sis', true);
  }

  meetOldSisSetTrue() {
    this.storyState.setFlag('meet_old_sis', true);
  }

  meetDadSetTrue(){
    this.storyState.setFlag('meet_dad',true)
  }
}
