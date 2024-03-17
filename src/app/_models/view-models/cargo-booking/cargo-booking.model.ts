import { FormGroupDirective } from "@angular/forms";
import {BookingStatus, PackageItemStatus} from "src/app/core/enums/common-enums";

export interface CargoBooking{
  id:string;
  bookingNumber: string;
  awbNumber: string;
  bookingDate: Date;
  destinationAirportId: string;
  destinationAirportCode: string;
  flightNumber:string;
  flightDate:Date | null;
  numberOfBoxes:number;
  totalWeight:number;
  bookingStatus:PackageItemStatus;
  shipmentCount:number;
}


export enum BookingStatusEnum {
  None = 0,
  BookingMade = 10,
  AWBAdded = 20,
  CargoReceived = 30,
  OffLoaded = 40,
  FlightDispatched = 50,
  FlightArrived = 60,
  Cancelled = 70
}

