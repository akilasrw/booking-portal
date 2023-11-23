import { AWBStatus } from './../../../../core/enums/common-enums';
import { BookingStatus } from "src/app/core/enums/common-enums";
import { AWBDetail } from "../../awb/awb-detail.model";
import { PackageItem } from "../../package-item.model";

export interface CargoBookingDetail{
    bookingNumber: string;
    bookingDate: Date;
    bookingStatus: BookingStatus;
    destinationAirportCode:string;
    originAirportCode:string;
    flightNumber:string;
    destinationAirportName:string;
    destinationAirportId:string;
    scheduledDepartureDateTime:Date;
    awbInformation?:AWBDetail;
    awbStatus:AWBStatus;
    packageItems: PackageItem[];    
  }

  