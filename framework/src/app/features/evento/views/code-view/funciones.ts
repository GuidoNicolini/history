import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { StoryState } from '../../../../shared/services/story-state';

export class Funciones {
  private storyState = inject(StoryState);
  private router = inject(Router);

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
  meetFamilyTrue(){
    console.log("meet family")
    this.storyState.setFlag('meet_family',true)
  }


  // el tipo podra ser una location o un evento y la url la direccion de ese lugar
  redirection(type: string , url: string){
    if (type === 'location') {
      this.router.navigate(['location/' + url]);
    } else if (type === 'evento') {
      this.router.navigate(['evento/' + url]);
    }
  }

}
