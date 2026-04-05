import {Component, computed} from '@angular/core';
import {HeroService} from '../../services/hero-service';

@Component({
  selector: 'app-hero-inventory',
  standalone: false,
  templateUrl: './hero-inventory.html',
  styleUrl: './hero-inventory.css',
})
export class HeroInventory {

  constructor(public heroService: HeroService) {}

  // Convertimos el diccionario de inventario en un array iterable
  public inventoryList = computed(() => {
    const inventory = this.heroService.state().inventory;
    return Object.entries(inventory).map(([itemName, quantity]) => ({
      itemName,
      quantity
    }));
  });


}
