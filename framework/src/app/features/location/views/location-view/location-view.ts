import {Component, OnInit} from '@angular/core';
import {Location} from '../../models/location';
import {LocationID} from '../../../../shared/enums/location-id';
import {LocationService} from '../../services/location-service';
import {ActivatedRoute} from '@angular/router';
import {EventoService} from '../../../evento/services/evento-service';
import {TimeService} from '../../../time/services/time-service';
import {TypeLocation} from '../../../../shared/enums/type-location';

@Component({
  selector: 'app-location-view',
  standalone: false,
  templateUrl: './location-view.html',
  styleUrl: './location-view.css',
})
export class LocationView implements OnInit {

  location !: Location;
  LocationId !: LocationID;
  subLocations !: Location[];

  constructor(
    private locationService: LocationService,
    private route: ActivatedRoute,
    private eventoService: EventoService,
    private timeService: TimeService
  ) {}

  ngOnInit(): void {
    // 1- Setear el locationID obteniendolo de la url
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.LocationId = Number(idParam) as LocationID;

        // 2- Obtener la location que corresponde a ese id y setearlo a location
        const foundLocation = this.locationService.findLocationById(this.LocationId);
        if (foundLocation) {
          this.location = foundLocation;

          // 3- Setear las subLocations
          this.subLocations = this.location.subLocations || [];

          // 4- Utilizar el metodo launchLocationEvento del servicio EventoService
          this.eventoService.launchLocationEvento(this.LocationId);

          // 5- Actualizar el tiempo según el TypeLocation
          let minutesToAdd = 0;
          switch (this.location.type) {
            case TypeLocation.ROOM:
            case TypeLocation.APARTMENT:
              minutesToAdd = 5;
              break;
            case TypeLocation.BUILDING:
              minutesToAdd = 10;
              break;
            case TypeLocation.DISTRIC:
              minutesToAdd = 20;
              break;
          }

          if (minutesToAdd > 0) {
            this.timeService.advanceMinutes(minutesToAdd);
          }
        }
      }
    });
  }
}
