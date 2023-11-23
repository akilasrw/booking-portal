import { FormGroupDirective } from "@angular/forms";
import { BookingStatus } from "src/app/core/enums/common-enums";

export interface CargoBooking{
  id:string;
  bookingNumber: string;
  awbNumber: string;
  bookingDate: Date;
  destinationAirportId: string;
  destinationAirportCode: string;
  flightNumber:string;
  flightDate:Date;
  numberOfBoxes:number;
  totalWeight:number;
  bookingStatus: BookingStatus;
}


