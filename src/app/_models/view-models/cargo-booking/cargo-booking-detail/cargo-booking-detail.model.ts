import { BookingStatus } from "src/app/core/enums/common-enums";
import { FlightScheduleSector } from "../../flight-schedule-sector.model";
import { PackageItem } from "../../package-item.model";

export interface CargoBookingDetail{
    bookingNumber: string;
    bookingDate: Date;
    bookingStatus: BookingStatus;
    flightScheduleSector: FlightScheduleSector;
    packageItems: PackageItem[];    
  }