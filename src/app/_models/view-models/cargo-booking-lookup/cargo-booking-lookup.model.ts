import { BookingStatus} from "src/app/core/enums/common-enums";
import { FlightScheduleSector } from "../flight-schedule-sectors/flight-schedule-sector.model";
import { PackageItem } from "../package-item.model";


export interface CargoBookingLookup{
    bookingNumber: string;
    bookingDate: Date;
    bookingStatus: BookingStatus;
    flightScheduleSector: FlightScheduleSector;
    packageItems: PackageItem[];    
   
  }