import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EventoService} from '../../services/evento-service';
import {EventoState} from '../../models/evento-state';
import {TimeService} from '../../../time';
import {EffectEvaluator} from '../../services/effect-evaluator';
import {Cube} from '../../models/Cube/cube';
import {TextCube} from '../../models/Cube/text-cube';
import {VideoCube} from '../../models/Cube/video-cube';
import {ImageCube} from '../../models/Cube/image-cube';
import {ButtonCube} from '../../models/Cube/button-cube';
import {CodeCube} from '../../models/Cube/code-cube';
import {FormCube} from '../../models/Cube/form-cube';

@Component({
  selector: 'app-evento-view',
  standalone: false,
  templateUrl: './evento-view.html',
  styleUrl: './evento-view.css',
})
export class EventoView implements OnInit{

  evento !: EventoState
  idEvento !: string
  displayCubes: Cube[] = [];

  constructor(private route: ActivatedRoute,private eventoService: EventoService,private timeService: TimeService, private effects: EffectEvaluator) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
       this.idEvento = params.get('id')!;
       this.evento = this.eventoService.getEventoById(this.idEvento)!
       this.eventoService.modifyLastDayUsedAndNumberOfTimesActivated(this.idEvento,this.timeService.state().day)
       const eventEffects = this.eventoService.getEffectsForEvento(this.idEvento);
       this.effects.applyAll(eventEffects)

       this.processCubes();
    })
  }

  processCubes(): void {
    if (!this.evento || !this.evento.cubes) return;

    const cubesByOrder = new Map<number, Cube[]>();

    // Agrupar los cubos por su propiedad 'order'
    for (const cube of this.evento.cubes) {
      if (!cubesByOrder.has(cube.order)) {
        cubesByOrder.set(cube.order, []);
      }
      cubesByOrder.get(cube.order)!.push(cube);
    }

    const processedCubes: Cube[] = [];

    // Por cada order, seleccionar solo un cubo
    for (const cubes of cubesByOrder.values()) {
      if (cubes.length === 1) {
        processedCubes.push(cubes[0]);
      } else {
        const totalProb = cubes.reduce((sum, c) => sum + (c.probability || 0), 0);

        if (totalProb === 0) {
          // Si no tienen probabilidad, elegimos uno por defecto para evitar errores
          processedCubes.push(cubes[0]);
          continue;
        }

        let random = Math.random() * totalProb;
        let selected = false;

        for (const cube of cubes) {
          const prob = cube.probability || 0;
          if (random < prob) {
            processedCubes.push(cube);
            selected = true;
            break;
          } else {
            random -= prob;
          }
        }

        // Fallback por eventuales problemas de precisión con punto flotante
        if (!selected) {
          processedCubes.push(cubes[cubes.length - 1]);
        }
      }
    }

    // Ordenar de menor a mayor
    this.displayCubes = processedCubes.sort((a, b) => a.order - b.order);
  }

  isText(cube:Cube): cube is TextCube {
    return cube.type === 'text';
  }

  isVideo(cube:Cube): cube is VideoCube {
    return cube.type === 'video';
  }

  isImage(cube:Cube): cube is ImageCube {
    return cube.type === 'image';
  }

  isButton(cube:Cube): cube is ButtonCube {
    return cube.type === 'button';
  }

  isCode(cube:Cube) : cube is CodeCube {
    return cube.type === 'code';
  }
  isForm(cube:Cube) : cube is FormCube{
    return cube.type === 'form';
  }

}
