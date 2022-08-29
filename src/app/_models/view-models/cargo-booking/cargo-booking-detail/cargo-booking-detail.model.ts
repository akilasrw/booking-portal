import { AWBStatus } from './../../../../core/enums/common-enums';
import { BookingStatus } from "src/app/core/enums/common-enums";
import { AWBDetail } from "../../awb/awb-detail.model";
import { FlightScheduleSector } from "../../flight-schedule-sectors/flight-schedule-sector.model";
import { PackageItem } from "../../package-item.model";

export interface CargoBookingDetail{
    bookingNumber: string;
    bookingDate: Date;
    bookingStatus: BookingStatus;
    flightScheduleSector: FlightScheduleSector;
    awbInformation?:AWBDetail;
    awbStatus:AWBStatus;
    packageItems: PackageItem[];    
  }