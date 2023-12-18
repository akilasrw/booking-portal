import { FormGroupDirective } from "@angular/forms";
import { BookingStatus } from "src/app/core/enums/common-enums";

export interface CargoBooking{
  id:string;
  bookingNumber: string;
  bookingDate: Date;
  destinationAirportId: string;
  destinationAirportCode: string;
  flightNumber:string;
  flightDate:Date;
  numberOfBoxes:number;
  totalWeight:number;
  bookingStatus: BookingStatus;
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

