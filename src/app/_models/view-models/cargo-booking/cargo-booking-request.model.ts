import { BookingStatus } from "src/app/core/enums/common-enums";
import { PackageItemRM } from "./package-item-request.model";

export class CargoBookingRequest {
  bookingStatus?: BookingStatus;
  flightScheduleSectorId?: string | null;
  packageItems?: PackageItemRM[];
}


