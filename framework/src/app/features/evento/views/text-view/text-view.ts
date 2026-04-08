import {Component, Input, OnInit} from '@angular/core';
import {TextCube} from '../../models/Cube/text-cube';
import {HeroService} from '../../../hero/services/hero-service';
import {NpcService} from '../../../npc/services/npc-service';
import {CharacterID} from '../../../../shared/enums/character-id';

@Component({
  selector: 'app-text-view',
  standalone: false,
  templateUrl: './text-view.html',
  styleUrl: './text-view.css',
})
export class TextView implements OnInit {

  @Input() cube!: TextCube;
  name!: string;
  avatar!: string;

  constructor(
    private heroService: HeroService,
    private npcService: NpcService
  ) {}

  ngOnInit(): void {
    if (this.cube.character === CharacterID.HERO) {
      this.name = this.heroService.getName();
      this.avatar = this.heroService.getAvatar();
    } else {
      this.name = this.npcService.getName(this.cube.character);
      this.avatar = this.npcService.getAvatar(this.cube.character);
    }
  }

}
