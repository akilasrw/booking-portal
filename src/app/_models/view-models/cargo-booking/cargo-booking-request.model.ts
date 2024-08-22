import { AWBStatus, BookingStatus } from "src/app/core/enums/common-enums";
import { AWBCreateRM } from "../../request-models/awb/awb-create-rm.model";
import { PackageItemRM } from "./package-item-request.model";

export class CargoBookingRequest {
  bookingStatus?: BookingStatus;
  aWBStatus?: AWBStatus;
  flightScheduleSectorIds?: string[];
  packageItems?: PackageItemRM[];
  aWBDetail?: AWBCreateRM;
  originAirportId?:string;
  destinationAirportId?:string;
  cargoHandlingInstruction?: string;
}


export interface PackageDetailsUpdateRM {
  width: number;
  height: number;
  weight: number;
  length: number;
  refNo: string;
}

