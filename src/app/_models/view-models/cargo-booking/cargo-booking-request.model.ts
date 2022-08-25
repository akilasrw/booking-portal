import { AWBStatus, BookingStatus } from "src/app/core/enums/common-enums";
import { AWBCreateRM } from "../../request-models/awb/awb-create-rm.model";
import { PackageItemRM } from "./package-item-request.model";

export class CargoBookingRequest {
  bookingStatus?: BookingStatus;
  AWBStatus?: AWBStatus;
  flightScheduleSectorId?: string | null;
  packageItems?: PackageItemRM[];
  aWBDetail?: AWBCreateRM;
}


