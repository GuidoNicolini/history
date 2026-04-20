import {LocationID} from '../../../shared/enums/location-id';
import {TypeLocation} from '../../../shared/enums/type-location';

export type ImageType = 'thumbnail' | 'background';

export interface Location {

  id: LocationID
  name: string
  type: TypeLocation
  images: Image[]
  url: string
  backUrl: string
  isAvailable: boolean;
  isVisible: boolean
  lastTimeVisited: number
  styleClass: string[];
  subLocations: LocationID[]
  conditionsAvailable: number[]
  conditionsVisible: number[]

}


export interface Image{
  type: ImageType
  url: string
}
