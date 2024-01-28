import { AWBStatus, BookingStatus} from "src/app/core/enums/common-enums";
import { AWBDetail } from "../awb/awb-detail.model";
import { FlightScheduleSector } from "../flight-schedule-sectors/flight-schedule-sector.model";
import { PackageItem } from "../package-item.model";


export interface CargoBookingLookup{
    bookingNumber: string;
    bookingDate: Date;
    bookingStatus: BookingStatus;
    aWBStatus: AWBStatus;
    flightNumber:string;
    verifyStatus:number;
    originAirportCode:string;
    destinationAirportCode:string;
    scheduledDepartureDateTime:Date;
    packageItems: PackageItem[];
    awbInformation?:AWBDetail;
    actualDepDateTime?: Date;
    actualArvDateTime?: Date;
  }
