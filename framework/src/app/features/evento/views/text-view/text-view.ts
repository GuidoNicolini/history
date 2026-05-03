import {Component, Input, OnInit} from '@angular/core';
import {TextCube} from '../../models/Cube/text-cube';
import {HeroService} from '../../../hero/services/hero-service';
import {NpcService} from '../../../npc/services/npc-service';
import {CharacterID} from '../../../../shared/enums/character-id';
import {UserConfigService} from '../../../../shared/services/user-config-service';

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

  mom !: string
  dad !: string
  youngSister !: string
  olderSister !: string
  brother !: string

  formattedText!: string;

  constructor(
    private heroService: HeroService,
    private npcService: NpcService,
    private userConfig : UserConfigService
  ) {}

  ngOnInit(): void {
    if (this.cube.character === CharacterID.HERO) {
      this.name = this.heroService.getName();
      this.avatar = this.heroService.getAvatar();
    } else {
      this.name = this.npcService.getName(this.cube.character);
      this.avatar = this.npcService.getAvatar(this.cube.character);
    }

    this.mom = this.userConfig.getMomName();
    this.dad = this.userConfig.getDadName();
    this.youngSister = this.userConfig.getYoungSisterName();
    this.olderSister = this.userConfig.getOlderSisterName();
    this.brother = this.userConfig.getBrotherName();


    // Reemplazamos las variables en el texto del JSON con sus valores reales.
    if (this.cube.text) {
      this.formattedText = this.cube.text
        .replace(/\{\{mom\}\}/g, this.mom)
        .replace(/\{\{dad\}\}/g, this.dad)
        .replace(/\{\{youngSister\}\}/g, this.youngSister)
        .replace(/\{\{olderSister\}\}/g, this.olderSister)
        .replace(/\{\{brother\}\}/g, this.brother);
    }
  }
}
